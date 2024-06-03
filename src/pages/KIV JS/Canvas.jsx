import { useState, useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';

export default function CanvasWithToolbar() {
  
  const canvasRef = useRef(null);
  const [tool, setTool] = useState({ strokeColor: 'black', strokeWidth: 4 });
  
  
  const handleToolChange = (newTool) => {
    setTool(newTool);
    canvasRef.current.eraseMode = newTool.strokeColor === 'white';
  };


  // Function to save drawing
  const saveDrawing = async () => {
    const dataURL = await canvasRef.current.exportImage("png");
    const response = await fetch(dataURL);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('image', blob, 'drawing.png');

    fetch('http://localhost:3000/api/drawings/save-drawing', {
      method: 'POST',
      body: formData,
    });
  };


  return (
    <>
      <div className="canvas-with-toolbar">
        <div className="toolbar">
          <button onClick={() => handleToolChange({ strokeColor: 'black', strokeWidth: 4 })}>Pencil</button>
          <button onClick={() => handleToolChange({ strokeColor: 'blue', strokeWidth: 8 })}>Paintbrush</button>
          <button onClick={() => handleToolChange({ strokeColor: 'white', strokeWidth: 10 })}>Eraser</button>
          <button onClick={saveDrawing}>Save</button>
        </div>
        <div className="canvas-container">
          <ReactSketchCanvas
            ref={canvasRef}
            width="1200px"
            height="700px"
            strokeWidth={tool.strokeWidth}
            strokeColor={tool.strokeColor}
            canvasColor="white"
          />
        </div>
      </div>
    </>
  );
}
