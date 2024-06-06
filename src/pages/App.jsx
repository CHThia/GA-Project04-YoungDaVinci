import { Routes, Route } from "react-router-dom"
import NavBar_Main from "../components/NavBar_Main"
import Home from "./Home"
import SignUp from "./SignUp"
import ForgotPassword from "./ForgotPassword"
import StudentDashboard from "./StudentDashboard"
import AllStudents from "./AllStudents"
import StudentArtWorks from "./StudentArtWorks"
import DrawingResources from "./DrawingResources"
import KonvaStudent from "../components/KonvaStudent"
//* import Canvas from "./Canvas"


export default function App() {
  

  return (
    <>
      <main >
        <NavBar_Main/>
        <br/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/allstudents" element={<AllStudents />} />
          <Route path="/allstudents/get-all-students/:student_id" element={<StudentArtWorks />} />
          <Route path="/drawingresources" element={<DrawingResources />} />        
          <Route path="/konva-student/:studentId/:assignmentId" element={<KonvaStudent />} />

          {/* <Route path="/canvas" element={<Canvas />} /> */}
          
        </Routes>
      </main>
    </>
  )
}
