import { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';


export default function KonvaStudent () {

  const [tool, setTool] = useState('pencil');
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const stageRef = useRef(null);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  // Function to download drawing
  const downloadDrawing = () => {
    const dataURL = stageRef.current.toDataURL();
    console.log(dataURL); 
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = dataURL;
    link.click();
  };

   // Function to save drawing
   const saveDrawing = async () => {
    try {
      const dataURL = stageRef.current.toDataURL();
      const response = await fetch(dataURL);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'drawing.png');

      const saveResponse = await fetch('http://localhost:3000/api/drawings/save-drawing', {
        method: 'POST',
        body: formData,
      });

      if (saveResponse.ok) {
        console.log('Drawing has been saved successfully.');
      } else {
        console.error('Error saving drawing:', saveResponse.statusText);
      }
    } catch (error) {
      console.error('An error occurred while saving the drawing:', error);
    }
  };
  
  return (
    <div className="canvas-container">
      <div className="buttons-container" >
        <button onClick={() => setTool('pencil')}>Pencil</button>
        <button onClick={() => setTool('eraser')}>Eraser</button>
        <button onClick={downloadDrawing}>Download</button>
        <button onClick={saveDrawing}>Save</button>
      </div>
      <Stage
        width={1080}
        height={720}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
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
  );
};

