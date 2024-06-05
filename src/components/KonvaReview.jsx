import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Image as KonvaImage } from 'react-konva';
import FeedbackBox from '../components/FeedBack_Box';

export default function KonvaReview({ assignmentId, assignmentData }) {

  console.log("What!!", assignmentId)

  const [tool, setTool] = useState('pencil');
  const [lines, setLines] = useState([]);
  const [color, setColor] = useState('#000000');
  const stageRef = useRef(null);
  const isDrawing = useRef(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (assignmentData) {
      const img = new window.Image();
      img.src = `data:image/png;base64,${assignmentData}`;
      img.onload = () => {
        setImage(img);
      };
    }
  }, [assignmentData]);

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
            width={500}
            height={300}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={stageRef}
            style={{ border: '1px solid black' }}
          >
            <Layer>
              <Rect x={0} y={0} width={500} height={300} fill="white" />
              {image && <KonvaImage image={image} x={0} y={0} width={500} height={300} />}
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
      <FeedbackBox assignmentId={assignmentId} drawingState={lines} />
    </>
  );
}
