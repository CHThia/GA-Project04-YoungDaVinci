import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Transformer, Rect } from 'react-konva';
import { useImage } from 'react-konva-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faEraser, faUndo, faRedo, faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import CustomColorPicker from './CustomColorPicker';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';


const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 300;


export default function KonvaTeacher({ onSave, selectedDrawing, clearSelection }) {

  const [imageURL, setImageURL] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image] = useImage(imageURL);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#ff9148');
  const [lines, setLines] = useState([]);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [selectedImage, setSelectedImage] = useState(null);
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const transformerRef = useRef(null);
  const isDrawing = useRef(false);
  const [openSnackBar, setopenSnackBar] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
    }
  }, [navigate]);

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
      const newWidth = aspectRatio > CANVAS_WIDTH / CANVAS_HEIGHT ? CANVAS_WIDTH : CANVAS_HEIGHT * aspectRatio;
      const newHeight = aspectRatio > CANVAS_WIDTH / CANVAS_HEIGHT ? CANVAS_WIDTH / aspectRatio : CANVAS_HEIGHT;
      setImageDimensions({ width: newWidth, height: newHeight });
    }
  }, [image]);

  useEffect(() => {
    if (transformerRef.current) {
      transformerRef.current.nodes(selectedImage ? [imageRef.current] : []);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedImage]);

  const resetCanvas = () => {
    setImageURL(null);
    setTitle('');
    setDescription('');
    setLines([]);
    setSelectedImage(null);
    setHistory([[]]);
    setHistoryIndex(0);
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
          const newWidth = aspectRatio > CANVAS_WIDTH / CANVAS_HEIGHT ? CANVAS_WIDTH : CANVAS_HEIGHT * aspectRatio;
          const newHeight = aspectRatio > CANVAS_WIDTH / CANVAS_HEIGHT ? CANVAS_WIDTH / aspectRatio : CANVAS_HEIGHT;
          setImageDimensions({ width: newWidth, height: newHeight });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCombinedMouseDown = (e) => {
    handleStageMouseDown(e);
    if (!selectedImage) {
      handleMouseDown(e);
    }
  };

  const handleStageMouseDown = (e) => {
    if (e.target === stageRef.current) {
      setSelectedImage(null);
    }
  };

  const handleMouseDown = () => {
    isDrawing.current = true;
    const pos = stageRef.current.getPointerPosition();
    setLines((prevLines) => [...prevLines, { tool, color, points: [pos.x, pos.y], strokeWidth }]);
  };

  const handleMouseMove = () => {
    if (!isDrawing.current || selectedImage) return;
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
    if (!selectedImage) {
      updateHistory([...lines]);
    }
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

  const saveDrawing = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = stageRef.current.width();
    canvas.height = stageRef.current.height();
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
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
        headers: {
          'x-auth-token': token
        },
        body: formData,
      });
      if (saveResponse.ok) {
        console.log('Drawing has been saved successfully.');
        onSave();
        clearSelection();
        resetCanvas();
        setopenSnackBar(true);
      } else {
        console.error('Error saving drawing:', saveResponse.statusText);
        setError('Error saving drawing');
      }
    };
  };

  const deleteDrawing = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
      return;
    }

    if (selectedDrawing) {
      const deleteResponse = await fetch(`/api/delete-drawing-resources/${selectedDrawing.drawing_resources_id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });
      if (deleteResponse.ok) {
        console.log('Drawing has been deleted successfully.');
        onSave();
        clearSelection();
        resetCanvas();
      } else {
        console.error('Error deleting drawing:', deleteResponse.statusText);
        setError('Error deleting drawing');
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

  const increaseStrokeWidth = () => {
    setStrokeWidth((prevWidth) => Math.min(prevWidth + 1, 20));
  };

  const decreaseStrokeWidth = () => {
    setStrokeWidth((prevWidth) => Math.max(prevWidth - 1, 1));
  };

  if (error) {
    return <div>{error}</div>;
  }

  
  return (
    <>
      <div className="drawing-teacher-container">
        <div className="tool-bar-container">
          <div className="tool-bar">
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
        </div>
        
        <div className="canvas-teacher-container">
          <Stage
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
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
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                fill="white"
              />
              {image && (
                <KonvaImage
                  image={image}
                  x={0}
                  y={0}
                  width={imageDimensions.width}
                  height={imageDimensions.height}
                  draggable={!!selectedImage}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                  ref={imageRef}
                  onClick={() => setSelectedImage(selectedImage ? null : imageRef.current)}
                  onTap={() => setSelectedImage(selectedImage ? null : imageRef.current)}
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
        
        <div className="content-container">
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
            style={{ fontFamily:"helvetica" }}
          />
          <input className="upload-image" type="file" accept="image/*" onChange={handleImageUpload} />
          <div className="button-container">
            <button className={selectedDrawing ? 'button-update' : 'button-save'} onClick={saveDrawing}>
              {selectedDrawing ? 'Update' : 'Save'}
            </button>
            {selectedDrawing && (
              <button className="button-delete" onClick={deleteDrawing}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
      <Snackbar 
        open={openSnackBar} 
        autoHideDuration={4000} 
        onClose={() => setopenSnackBar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ bottom: '60%'}}
      >
        <Alert onClose={() => setopenSnackBar(false)} severity="success" sx={{ width: '100%' }}>
          Drawing Resource saved successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
