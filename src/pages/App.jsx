import { Routes, Route, useLocation } from "react-router-dom";
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

export default function App () {

  const location = useLocation();

  const getNavBar = () => {
    if (location.pathname.startsWith('/studentdashboard')) {
      return <NavBar_Student />;
    } else if (location.pathname.startsWith('/AllStudents')) { // Need to tidy the route name
      return <NavBar_Teacher />;
    } else {
      return <NavBar_Main />;
    }
  };

  return (
    <>
      <main>
        {getNavBar()}
        <br />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teachersignup" element={<TeacherSignUp />} />
          <Route path="/studentsignup" element={<StudentSignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/studentdashboard/:studentId" element={<StudentDashboard />} />
          <Route path="/allstudents" element={<AllStudents />} />
          <Route path="/allstudents/get-all-students/:student_id" element={<StudentArtWorks />} />
          <Route path="/drawingresources" element={<DrawingResources />} />
          <Route path="/konva-student/:studentId/:assignmentId" element={<KonvaStudent />} />
          {/* <Route path="/canvas" element={<Canvas />} /> */}
        </Routes>
      </main>
    </>
  );
}
