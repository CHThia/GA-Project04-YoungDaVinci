import { useLocation } from 'react-router-dom';
import Drawer_PopUp from "../components/Drawer_PopUp";
import KonvaReview from "../components/KonvaReview"
import FeedBackBox from "../components/FeedBack_Box";


export default function StudentArtWorks() {
 
  const { state } = useLocation();
  const studentId = state || null;
  
  // console.log("Test 2", studentId)


  return (
    <>
      <KonvaReview studentId={studentId} />

      <FeedBackBox studentId={studentId} />
      
      <Drawer_PopUp studentId={studentId} />
      
    </>
  );
}
