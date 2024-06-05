import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Drawer_PopUp from "../components/Drawer_PopUp";
import KonvaReview from "../components/KonvaReview"


export default function StudentArtWorks() {
 
  const { state } = useLocation();
  const studentId = state || null;
  // console.log("Test 2", studentId)

  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleImageClick = (assignmentData) => {
    setSelectedAssignment(assignmentData);
  };

  return (
    <>
      <KonvaReview studentId={studentId} assignmentData={selectedAssignment}/>
      
      <Drawer_PopUp studentId={studentId} onImageClick={handleImageClick} />

    </>
  );
}
