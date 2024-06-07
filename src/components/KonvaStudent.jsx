import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Image as KonvaImage } from 'react-konva';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export default function KonvaStudent() {
  const { studentId, assignmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tool, setTool] = useState('pencil');
  const [lines, setLines] = useState([]);
  const [initialImage, setInitialImage] = useState(null);
  const isDrawing = useRef(false);
  const stageRef = useRef(null);


  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const assignmentData = location.state?.assignmentData;
        if (assignmentData) {
          console.log('Using assignment data from location state.');
          const image = new window.Image();
          image.src = `data:image/png;base64,${assignmentData}`;
          image.onload = () => {
            setInitialImage(image);
            console.log('Image loaded from state:', image);
          };
        } else {
          console.log('Fetching assignment data from backend.');
          console.log('Assignment ID:', assignmentId); // Log the assignment_id to ensure it's being passed correctly
          const response = await fetch(`/api/get-assignments/${assignmentId}`);
          if (response.ok) {
            const assignment = await response.json();
            // console.log('Fetched assignment:', assignment);
            if (assignment.assignment_data) {
              const image = new window.Image();
              image.src = `data:image/png;base64,${assignment.assignment_data}`;
              image.onload = () => {
                setInitialImage(image);
                // console.log('Image loaded from fetch:', image);
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


  const handleMouseDown = (event) => {
    isDrawing.current = true;
    const pos = event.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (event) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = event.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
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
        console.log(`Drawing has been ${status === 'completed' ? 'submitted' : 'saved'} successfully.`);
        navigate(`/studentdashboard/${studentId}`); // Use this once Authentication Page is done
        // navigate(`/studentdashboard`); // Redirect to the dashboard
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

  return (
    <div className="canvas-container">
      <div className="buttons-container">
        <button onClick={() => setTool('pencil')}>Pencil</button>
        <button onClick={() => setTool('eraser')}>Eraser</button>
        <button onClick={() => saveDrawing('in_progress')}>Save</button>
        <button onClick={() => saveDrawing('completed')}>Submit</button>
        <button onClick={downloadDrawing}>Download</button>
      </div>
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
}
