import { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const [assignmentsImages, setAssignmentsImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({ new: 0, in_progress: 0, completed: 0 });
  const [studentName, setStudentName] = useState(localStorage.getItem('studentName') || '');

  const { studentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Student ID:', studentId); // Log the studentId to verify
    console.log('Location state:', location.state); // Log the location state

    // Extract studentName from location state if available
    if (location.state && location.state.studentName) {
      console.log('Setting student name:', location.state.studentName); // Log setting name
      setStudentName(location.state.studentName);
      localStorage.setItem('studentName', location.state.studentName); // Store student name in localStorage
    }

    if (studentId) {
      localStorage.setItem('studentId', studentId); // Store studentId in localStorage
    }
  }, [studentId, location.state]);

  const fetchCounts = useCallback(async () => {
    if (!studentId) return; // Ensure studentId is defined
    console.log('Fetching counts for student ID:', studentId); // Add log
    try {
      const response = await fetch(`/api/assignment-counts/${studentId}`);
      if (response.ok) {
        const countsData = await response.json();
        setCounts(countsData);
      } else {
        throw new Error('Failed to fetch counts');
      }
    } catch (err) {
      console.error('Error fetching counts:', err);
    }
  }, [studentId]);

  const fetchAssignments = useCallback(async (category) => {
    if (!studentId) return; // Ensure studentId is defined
    setLoading(true);
    setError(null);

    let url;
    if (category && category !== 'all') {
      url = `/api/get-all-assignments/${studentId}/${category}`;
    } else {
      url = `/api/get-all-assignments/${studentId}`;
    }

    console.log(`Fetching assignments from ${url}`); // Add log

    try {
      const response = await fetch(url);
      if (response.ok) {
        const assignmentsList = await response.json();
        console.log('Assignments List:', assignmentsList); // Log assignments list

        setAssignmentsImages(assignmentsList.map(assignment => ({
          src: assignment.assignment_data ? `data:image/png;base64,${assignment.assignment_data}` : '',
          assignmentId: assignment.assignment_id,
          assignmentData: assignment.assignment_data,
          title: assignment.title,
          description: assignment.description
        })));

        console.log(`Success to fetch from ${url}`);
      } else {
        throw new Error(`Failed to fetch from ${url}`);
      }
    } catch (err) {
      console.error('Error fetching:', err);
      setError('Failed to fetch contents. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchCounts();
    fetchAssignments();
  }, [fetchCounts, fetchAssignments, studentId]);

  useEffect(() => {
    if (selectedCategory) {
      fetchAssignments(selectedCategory);
    }
  }, [fetchAssignments, selectedCategory]);

  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const navigateToKonvaStudent = (assignmentId, assignmentData) => {
    navigate(`/konva-student/${studentId}/${assignmentId}`, { state: { assignmentData, studentId } });
  };

  return (
    <>
      <div className="dashboard-student-container">
        <div className="dashboard-greet">
          <h1>Welcome back, {studentName}!</h1>
        </div>

        <div className="assignment-container">
          <div className="text-my-assignment">
            <h2>Assignments</h2>
            <ul>
              <li><a href="#all" onClick={() => handleCategoryClick('all')}>All ({counts.all})</a></li>
              <li><a href="#new" onClick={() => handleCategoryClick('new')}>New ({counts.new})</a></li>
              <li><a href="#in-progress" onClick={() => handleCategoryClick('in_progress')}>In Progress ({counts.in_progress})</a></li>
              <li><a href="#completed" onClick={() => handleCategoryClick('completed')}>Completed ({counts.completed})</a></li>
            </ul>
          </div>

          <div className="review-assignment">
            {loading ? (
              <p>Loading assignments...</p>
            ) : error ? (
              <p>{error}</p>
            ) : assignmentsImages.length > 0 ? (
              assignmentsImages.map((assignment, index) => (
                <div key={index} className="assignment-item">
                  <a
                    onClick={() => navigateToKonvaStudent(assignment.assignmentId, assignment.assignmentData)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={assignment.src} alt={`Drawing ${index + 1}`} />
                  </a>
                  <div className="assignment-details">
                    <h2>Title: {assignment.title}</h2>
                    <p>Description: {assignment.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>{selectedCategory ? 'No contents are found.' : 'Select a category from Assignments.'}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
