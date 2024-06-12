import { Routes, Route } from "react-router-dom";
import NavBar_Main from "../components/NavBar_Main";
import NavBar_Teacher from "../components/NavBar_Teacher";
import NavBar_Student from "../components/NavBar_Student";
import Home from "./Home";
import TeacherSignUp from "./TeacherSignUp";
import StudentSignUp from "./StudentSignUp";
import ForgotPassword from "./ForgotPassword";
import StudentDashboard from "./StudentDashboard";
import AllStudents from "./AllStudents";
import StudentArtWorks from "./StudentArtWorks";
import DrawingResources from "./DrawingResources";
import KonvaStudent from "../components/KonvaStudent";
import { useUser } from '../../context/userContext';
import ProtectedRoute from '../components/ProtectedRoute';

export default function App() {
  // const location = useLocation();
  const { role } = useUser();

  const getNavBar = () => {
    if (role === 'student') {
      return <NavBar_Student />;
    } else if (role === 'teacher') {
      return <NavBar_Teacher />;
    } else {
      return <NavBar_Main />;
    }
  };

  return (
    <>
      {getNavBar()}
      <br />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teachersignup" element={<TeacherSignUp />} />
        <Route path="/studentsignup" element={<StudentSignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        <Route path="/studentdashboard/:studentId"
          element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} 
        />

        <Route path="/allstudents"
          element={<ProtectedRoute allowedRoles={['teacher']}><AllStudents /></ProtectedRoute>}  
        />

        <Route path="/allstudents/get-all-students/:student_id"
          element={<ProtectedRoute allowedRoles={['teacher']}><StudentArtWorks /></ProtectedRoute>} 
        />

        <Route path="/drawingresources"
          element={<ProtectedRoute allowedRoles={['teacher']}><DrawingResources /></ProtectedRoute>} 
        />

        <Route path="/konva-student/:studentId/:assignmentId"
          element={<ProtectedRoute allowedRoles={['student']}><KonvaStudent /></ProtectedRoute>} 
        />
      </Routes>
    </>
  );
}
