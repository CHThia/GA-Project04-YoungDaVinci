import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Image as KonvaImage, Transformer } from 'react-konva';
import FeedbackBox from '../components/FeedBack_Box';
import CustomColorPicker from './CustomColorPicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faEraser, faUndo, faRedo, faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';


export default function KonvaReview({ assignmentId, assignmentData }) {

  const [tool, setTool] = useState('pencil');
  const [lines, setLines] = useState([]);
  const [color, setColor] = useState('#ff9148');
  const stageRef = useRef(null);
  const isDrawing = useRef(false);
  const [image, setImage] = useState(null);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const imageRef = useRef(null);
  const transformerRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (assignmentData) {
      const img = new window.Image();
      img.src = `data:image/png;base64,${assignmentData}`;
      img.onload = () => {
        setImage(img);
        const aspectRatio = img.width / img.height;
        const newWidth = aspectRatio > 500 / 300 ? 500 : 300 * aspectRatio;
        const newHeight = aspectRatio > 500 / 300 ? 500 / aspectRatio : 300;
        setImageDimensions({ width: newWidth, height: newHeight });
      };
    }
  }, [assignmentData]);

  useEffect(() => {
    if (transformerRef.current && selectedImage) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedImage]);

  const handleMouseDown = () => {
    isDrawing.current = true;
    const pos = stageRef.current.getPointerPosition();
    setLines((prevLines) => [...prevLines, { tool, color, points: [pos.x, pos.y], strokeWidth }]);
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
    updateHistory([...lines]);
  };

  const updateHistory = (newLines) => {
    const newHistory = [...history.slice(0, historyIndex + 1), newLines];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setLines(history[historyIndex - 1]);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setLines(history[historyIndex + 1]);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const resetCanvas = () => {
    setLines([]);
    setHistory([[]]);
    setHistoryIndex(0);
  };

  const increaseStrokeWidth = () => {
    setStrokeWidth((prevWidth) => Math.min(prevWidth + 1, 20));
  };

  const decreaseStrokeWidth = () => {
    setStrokeWidth((prevWidth) => Math.max(prevWidth - 1, 1));
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
      <div className="drawing-review-container">
        <div className="review-tool-bar">
          <CustomColorPicker color={color} onChange={setColor} />
          <button onClick={() => setTool('pencil')} className="pencil">
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>
          <button onClick={increaseStrokeWidth} className="increase-stroke">
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button onClick={decreaseStrokeWidth} className="decrease-stroke">
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <br/>
          <button onClick={() => setTool('eraser')} className="eraser">
            <FontAwesomeIcon icon={faEraser} />
          </button>
          <button onClick={undo} className="undo">
            <FontAwesomeIcon icon={faUndo} />
          </button>
          <button onClick={redo} className="redo">
            <FontAwesomeIcon icon={faRedo} />
          </button>
          <button onClick={resetCanvas} className="clear-canvas">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>

        <div className="review-canvas">
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
                  strokeWidth={line.strokeWidth}
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

        <FeedbackBox assignmentId={assignmentId} drawingState={assignmentData} />

      </div>
    </>
  );
}
