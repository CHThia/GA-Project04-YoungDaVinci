import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Line } from 'react-konva';
import { useImage } from 'react-konva-utils';

export default function KonvaTeacher({ onSave }) {
  const [imageURL, setImageURL] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image] = useImage(imageURL);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000'); // Color Picker
  const [lines, setLines] = useState([]);
  const stageRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (image) {
      const aspectRatio = image.width / image.height;
      const newWidth = aspectRatio > 1080 / 720 ? 1080 : 720 * aspectRatio;
      const newHeight = aspectRatio > 1080 / 720 ? 1080 / aspectRatio : 720;
      image.width = newWidth;
      image.height = newHeight;
    }
  }, [image]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = () => {
    isDrawing.current = true;
    const pos = stageRef.current.getPointerPosition();
    setLines((prevLines) => [...prevLines, { tool, color, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = () => {
    if (!isDrawing.current) return;
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    setLines((prevLines) => {
      const lastLine = prevLines[prevLines.length - 1];
      const newPoints = lastLine.points.concat([point.x, point.y]);
      const newLine = { ...lastLine, points: newPoints };
      return [...prevLines.slice(0, -1), newLine];
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const saveDrawing = async () => {
    try {
      const dataURL = stageRef.current.toDataURL();
      const response = await fetch(dataURL);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('details', blob, 'drawing.png');

      const saveResponse = await fetch('http://localhost:3000/api/create-drawing-resources', {
        method: 'POST',
        body: formData,
      });

      if (saveResponse.ok) {
        console.log('Drawing has been saved successfully.');
        onSave();
      } else {
        console.error('Error saving drawing:', saveResponse.statusText);
      }
    } catch (error) {
      console.error('An error occurred while saving the drawing:', error);
    }
  };

  return (
    <>
      <div className="drawing-container">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <br />
        <div className="tool-bar">
          <button onClick={() => setTool('pencil')}>Pencil</button>
          <button onClick={() => setTool('eraser')}>Eraser</button>
          <button onClick={saveDrawing}>Save</button>
        </div>

        <div className="color-picker">
          <label>Color Picker</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>

        <div className="canvas-container">
          <Stage
            width={1080}
            height={720}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={stageRef}
          >
            <Layer>
              <Rect
                x={0}
                y={0}
                width={1080}
                height={720}
                fill={"#F5F5F5"}
              />
              {image && <KonvaImage image={image} x={0} y={0} draggable />}
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.tool === 'eraser' ? 'white' : line.color}
                  strokeWidth={5}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={
                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </>
  );
}
