import { useRef, useState } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';


export default function KonvaReview () {

  const [tool, setTool] = useState('pencil');
  const [lines, setLines] = useState([]);
  const [color, setColor] = useState('#000000'); // Color Picker
  const stageRef = useRef(null);
  const isDrawing = useRef(false);


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

  return (
    <>
      <div className="drawing-review-container">
        <div className="tool-bar">
          <button onClick={() => setTool('pencil')}>Pencil</button>
          <button onClick={() => setTool('eraser')}>Eraser</button>
        </div>

        <div className="canvas-review-container">
          <Stage
            width={1080}
            height={720}
            onMouseDown={handleMouseDown}
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
