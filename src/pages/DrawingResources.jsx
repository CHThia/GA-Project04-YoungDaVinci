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
    try {
      const response = await fetch('/api/get-drawing-resources');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSavedDrawings(data);
    } catch (error) {
      console.error('Error fetching drawings:', error);
    }
  };

  const fetchDrawingById = async (drawing_resources_id) => {
    try {
      const response = await fetch(`/api/get-drawing-resources/${drawing_resources_id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSelectedDrawing(data);
    } catch (error) {
      console.error('Error fetching drawing by drawing_resources_id:', error);
    }
  };

  const deleteDrawingById = async (drawing_resources_id) => {
    try {
      const response = await fetch(`/api/delete-drawing-resources/${drawing_resources_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchDrawings(); // Refresh the drawings list
    } catch (error) {
      console.error('Error deleting drawing:', error);
    }
  };

  const clearSelection = () => {
    setSelectedDrawing(null);
  };

  return (
    <>
        <DropDown 
          savedDrawings={savedDrawings} 
          fetchDrawingById={fetchDrawingById} 
          deleteDrawingById={deleteDrawingById} 
        />

        <KonvaTeacher 
          onSave={fetchDrawings} 
          selectedDrawing={selectedDrawing} 
          clearSelection={clearSelection} 
        />
    </>
  );
}