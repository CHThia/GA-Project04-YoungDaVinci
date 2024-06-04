import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Transformer, Rect } from 'react-konva';
import { useImage } from 'react-konva-utils';


export default function KonvaTeacher({ onSave, selectedDrawing, clearSelection }) {

  const [imageURL, setImageURL] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image] = useImage(imageURL);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000'); // Color Picker
  const [lines, setLines] = useState([]);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [selectedImage, setSelectedImage] = useState(null);
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const transformerRef = useRef(null);
  const isDrawing = useRef(false);

  
  useEffect(() => {
    if (selectedDrawing) {
      setTitle(selectedDrawing.title);
      setDescription(selectedDrawing.description);
      setImageURL(`data:image/png;base64,${selectedDrawing.details}`);
    } else {
      resetCanvas();
    }
  }, [selectedDrawing]);

  useEffect(() => {
    if (image) {
      const aspectRatio = image.width / image.height;
      const newWidth = aspectRatio > 1080 / 720 ? 1080 : 720 * aspectRatio;
      const newHeight = aspectRatio > 1080 / 720 ? 1080 / aspectRatio : 720;
      setImageDimensions({ width: newWidth, height: newHeight });
    }
  }, [image]);

  useEffect(() => {
    if (transformerRef.current && selectedImage) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedImage]);

  const resetCanvas = () => {
    setImageURL(null);
    setTitle('');
    setDescription('');
    setLines([]);
    setSelectedImage(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageURL(reader.result);
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const newWidth = aspectRatio > 1080 / 720 ? 1080 : 720 * aspectRatio;
          const newHeight = aspectRatio > 1080 / 720 ? 1080 / aspectRatio : 720;
          setImageDimensions({ width: newWidth, height: newHeight });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCombinedMouseDown = (e) => {
    handleStageMouseDown(e);
    handleMouseDown(e);
  };

  const handleStageMouseDown = (e) => {
    if (e.target === stageRef.current) {
      setSelectedImage(null);
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
    // Create a new off-screen canvas
    const canvas = document.createElement('canvas');
    canvas.width = stageRef.current.width();
    canvas.height = stageRef.current.height();
    const context = canvas.getContext('2d');
  
    // Fill the canvas with white
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw the Konva stage onto the off-screen canvas
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    const img = new Image();
    img.src = dataURL;
    img.onload = async () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      const finalDataURL = canvas.toDataURL();
  
      const response = await fetch(finalDataURL);
      const blob = await response.blob();
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('details', blob, 'drawing.png');
  
      const saveResponse = await fetch(selectedDrawing ? 
        `/api/update-drawing-resources/${selectedDrawing.drawing_resources_id}` : '/api/create-drawing-resources', {
        method: selectedDrawing ? 'PUT' : 'POST',
        body: formData,
      });
  
      if (saveResponse.ok) {
        console.log('Drawing has been saved successfully.');
        onSave(); // Call the onSave callback to refresh the list of saved drawings
        clearSelection();
        resetCanvas();
      } else {
        console.error('Error saving drawing:', saveResponse.statusText);
      }
    };
  };

  const deleteDrawing = async () => {
    if (selectedDrawing) {
      const deleteResponse = await fetch(`/api/delete-drawing-resources/${selectedDrawing.drawing_resources_id}`, {
        method: 'DELETE',
      });

      if (deleteResponse.ok) {
        console.log('Drawing has been deleted successfully.');
        onSave(); // Call the onSave callback to refresh the list of saved drawings
        clearSelection();
        resetCanvas();
      } else {
        console.error('Error deleting drawing:', deleteResponse.statusText);
      }
    }
  };

  const handleDragMove = (e) => {
    const { x, y } = e.target.position();
    console.log('Node dragged to:', x, y);
  };

  const handleDragEnd = (e) => {
    const { x, y } = e.target.position();
    console.log('Node drag ended at:', x, y);
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
          <button onClick={saveDrawing}>{selectedDrawing ? 'Update' : 'Save'}</button>
          {selectedDrawing && <button onClick={deleteDrawing}>Delete</button>}
        </div>

        <div className="color-picker">
          <label>Color Picker</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>

        <div className="canvas-container">
          <Stage
            width={1080}
            height={720}
            onMouseDown={handleCombinedMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={stageRef}
            style={{ border: '1px solid black' }}
          >
            <Layer>
              <Rect
                  x={0}
                  y={0}
                  width={1080}
                  height={720}
                  fill="white"
                />
              {image && (
                <KonvaImage
                  image={image}
                  x={0}
                  y={0}
                  width={imageDimensions.width}
                  height={imageDimensions.height}
                  draggable
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                  ref={imageRef}
                  onClick={() => setSelectedImage(imageRef.current)}
                  onTap={() => setSelectedImage(imageRef.current)}
                />
              )}
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
              <Transformer ref={transformerRef} />
            </Layer>
          </Stage>
        </div>
      </div>
    </>
  );
}
