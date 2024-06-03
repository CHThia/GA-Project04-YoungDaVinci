import { useState, useEffect } from 'react';
import DropDown from "../components/DropDown";
import KonvaTeacher from "../components/KonvaTeacher";


export default function DrawingResources() {

  const [savedDrawings, setSavedDrawings] = useState([]);
  const [selectedDrawing, setSelectedDrawing] = useState(null);


  useEffect(() => {
    fetchDrawings();
  }, []);

  const fetchDrawings = async () => {
    const response = await fetch('http://localhost:3000/api/get-drawing-resources');
    const data = await response.json();
    setSavedDrawings(data);
  };

  const fetchDrawingById = async (id) => {
    const response = await fetch(`http://localhost:3000/api/get-drawing-resources/:drawing_resources_${id}`);
    const data = await response.json();
    setSelectedDrawing(data);
  };


  return (
    <>
      <div className="accordion-container">
        <DropDown savedDrawings={savedDrawings} fetchDrawingById={fetchDrawingById} />
      </div>
      
      <KonvaTeacher onSave={fetchDrawings} />

      {selectedDrawing && (
        <div>
          <h2>{selectedDrawing.title}</h2>
          <p>{selectedDrawing.description}</p>
          <img src={`data:image/png;base64,${selectedDrawing.details}`} alt={selectedDrawing.title} />
        </div>
      )}
    </>
  );
}
