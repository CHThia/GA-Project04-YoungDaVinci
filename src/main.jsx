import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App.jsx';
import { UserProvider } from '../context/userContext';

import "./css/home.css";
import "./css/all_students.css";
import "./css/student_dashboard.css";
import "./css/drawing_resources.css";
import "./css/student_canvas.css"
import "./css/inputs.css";
import "./css/buttons.css";
import "./css/review_artwork.css";
// import "./css/canvas.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
