import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Line } from 'react-konva';
import { useImage } from 'react-konva-utils';


export default function KonvaTeacher () {

  const [imageURL, setImageURL] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image] = useImage(imageURL);
  const [tool, setTool] = useState('brush');
  const [color, setColor] = useState('#000000');
  const [lines, setLines] = useState([]);
  const stageRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (image) {
      const aspectRatio = image.width / image.height;
      let newWidth = 1080;
      let newHeight = 720;
      if (aspectRatio > 1080 / 720) {
        newHeight = 1080 / aspectRatio;
      } else {
        newWidth = 720 * aspectRatio;
      }
      image.width = newWidth;
      image.height = newHeight;
    }
  }, [image]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageURL(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = () => {
    isDrawing.current = true;
    const pos = stageRef.current.getPointerPosition();
    setLines([...lines, { tool, color, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = () => {
    if (!isDrawing.current) {
      return;
    }
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleSave = async () => {
    
    // const dataURL = stageRef.current.toDataURL();
    // const drawingData = {
    //   title,
    //   description,
    //   canvas: dataURL,
    // };
    // try {
    //   // Replace with your API endpoint
    //   const response = await fetch('/api/save-drawing', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(drawingData),
    //   });

    //   if (!response.ok) {
    //     throw new Error('Network response was not ok');
    //   }

    //   const result = await response.json();
    //   console.log('Saving:', result);
    // } catch (error) {
    //   console.error('Error saving drawing:', error);
    // }

    console.log("Mock save works!!")
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

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <div className="tool-bar">
          <button onClick={() => setTool('brush')}>Brush</button>
          <button onClick={() => setTool('eraser')}>Eraser</button>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>

        <div className="canvas-container">
          <Stage
            width={1080}
            height={720}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            ref={stageRef}
          >
            <Layer>
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

        <button onClick={handleSave}>Save</button>
      </div>
    </>
  )
}