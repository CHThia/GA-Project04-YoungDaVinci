import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Image as KonvaImage, Rect } from 'react-konva';
import { useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faEraser, faUndo, faRedo, faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import CustomColorPicker from './CustomColorPicker';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function KonvaStudent() {

  // const { studentId, assignmentId } = useParams();
  // const navigate = useNavigate();

  const { assignmentId } = useParams();

  const location = useLocation();
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#ff9148');
  const [lines, setLines] = useState([]);
  const [initialImage, setInitialImage] = useState(null);
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const isDrawing = useRef(false);
  const stageRef = useRef(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const assignmentData = location.state?.assignmentData;
        if (assignmentData) {
          const image = new window.Image();
          image.src = `data:image/png;base64,${assignmentData}`;
          image.onload = () => {
            setInitialImage(image);
          };
        } else {
          console.log('Fetching assignment data from backend.');
          console.log('Assignment ID:', assignmentId);
          const response = await fetch(`/api/get-assignments/${assignmentId}`);
          if (response.ok) {
            const assignment = await response.json();
            if (assignment.assignment_data) {
              const image = new window.Image();
              image.src = `data:image/png;base64,${assignment.assignment_data}`;
              image.onload = () => {
                setInitialImage(image);
              };
            }
          } else {
            console.error('Failed to fetch assignment data.');
          }
        }
      } catch (error) {
        console.error('Error fetching assignment:', error);
      }
    };

    fetchAssignment();
  }, [assignmentId, location.state]);

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

  const saveDrawing = async (status) => {
    try {
      const dataURL = stageRef.current.toDataURL();
      const response = await fetch(dataURL);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'drawing.png');

      const saveResponse = await fetch(`/api/update-assignment/${assignmentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          assignment_data: dataURL.split(',')[1],
          assignment_status: status
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (saveResponse.ok) {
        setSnackbarMessage(`Drawing has been ${status === 'completed' ? 'submitted' : 'saved'} successfully.`);
        setOpenSnackbar(true);
        // Comment out the navigate line to prevent routing back
        // navigate(`/studentdashboard/${studentId}`); // Use this once Authentication Page is done
      } else {
        console.error(`Error ${status === 'completed' ? 'submitting' : 'saving'} drawing:`, saveResponse.statusText);
      }
    } catch (error) {
      console.error(`An error occurred while ${status === 'completed' ? 'submitting' : 'saving'} the drawing:`, error);
    }
  };

  const downloadDrawing = () => {
    const dataURL = stageRef.current.toDataURL();
    console.log(dataURL);
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = dataURL;
    link.click();
  };

  const increaseStrokeWidth = () => {
    setStrokeWidth((prevWidth) => Math.min(prevWidth + 1, 20));
  };

  const decreaseStrokeWidth = () => {
    setStrokeWidth((prevWidth) => Math.max(prevWidth - 1, 1));
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="student-canvas-container">

      <div className="student-tools">
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
        <br />
        <button onClick={() => setTool('eraser')} className="eraser">
          <FontAwesomeIcon icon={faEraser} />
        </button>
        <button onClick={undo} className="undo">
          <FontAwesomeIcon icon={faUndo} />
        </button>
        <button onClick={redo} className="redo">
          <FontAwesomeIcon icon={faRedo} />
        </button>
        <button onClick={() => setLines([])} className="clear-canvas">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      <div className="student-draw-canvas">
        <Stage
          width={500}
          height={300}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          ref={stageRef}
          style={{ border: '1px solid black' }}
        >
          <Layer>
            <Rect x={0} y={0} width={500} height={300} fill="white" />
            {initialImage && (
              <KonvaImage
                image={initialImage}
                x={0}
                y={0}
                width={500}
                height={300}
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
          </Layer>
        </Stage>
      </div>

      <div className="student-save-content">
        <button className="button-save" onClick={() => saveDrawing('in_progress')}>Save</button>
        <button className="button-submit" onClick={() => saveDrawing('completed')}>Submit</button>
        <button className="button-download" onClick={downloadDrawing}>Download</button>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ bottom: '-20%' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}