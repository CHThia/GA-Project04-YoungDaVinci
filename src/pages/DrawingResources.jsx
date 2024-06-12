import { useState, useEffect } from 'react';
import DropDown from "../components/DropDown";
import KonvaTeacher from "../components/KonvaTeacher";
import { useNavigate } from 'react-router-dom';


export default function DrawingResources() {
  
  const [savedDrawings, setSavedDrawings] = useState([]);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
    } else {
      fetchDrawings(token);
    }
  }, [navigate]);


  const fetchDrawings = async (token) => {
    try {
      const response = await fetch('/api/get-drawing-resources', {
        headers: {
          'x-auth-token': token
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSavedDrawings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching drawings:', error);
      setError('Error fetching drawings');
    }
  };

  const fetchDrawingById = async (drawing_resources_id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/get-drawing-resources/${drawing_resources_id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSelectedDrawing(data);
    } catch (error) {
      console.error('Error fetching drawing by drawing_resources_id:', error);
      setError('Error fetching drawing by drawing_resources_id');
    }
  };

  const deleteDrawingById = async (drawing_resources_id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/delete-drawing-resources/${drawing_resources_id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchDrawings(token); // Refresh drawings list
    } catch (error) {
      console.error('Error deleting drawing:', error);
      setError('Error deleting drawing');
    }
  };

  const clearSelection = () => {
    setSelectedDrawing(null);
  };

  if (error) {
    return <div>{error}</div>;
  }

  
  return (
    <>
      <DropDown 
        savedDrawings={savedDrawings} 
        fetchDrawingById={fetchDrawingById} 
        deleteDrawingById={deleteDrawingById} 
      />

      <KonvaTeacher 
        onSave={() => fetchDrawings(localStorage.getItem('token'))} 
        selectedDrawing={selectedDrawing} 
        clearSelection={clearSelection} 
      />
    </>
  );
}