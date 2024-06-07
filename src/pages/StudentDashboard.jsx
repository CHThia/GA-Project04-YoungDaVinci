import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function StudentDashboard() {
  const [assignmentsImages, setAssignmentsImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({ new: 0, in_progress: 0, completed: 0 });

  const { studentId } = useParams();

  useEffect(() => {
    console.log('Student ID:', studentId); // Log the studentId to verify
  }, [studentId]);

  const fetchCounts = async () => {
    if (!studentId) return; // Ensure studentId is defined
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
  };

  const fetchAssignments = async (category) => {
    if (!studentId) return; // Ensure studentId is defined
    setLoading(true);
    setError(null);

    let url;
    if (category) {
      url = `/api/get-all-assignments/${studentId}/${category}`;
    } else {
      url = `/api/get-all-assignments/${studentId}`;
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        const assignmentsList = await response.json();
        setAssignmentsImages(assignmentsList.map(assignment => ({
          src: assignment.assignment_data ? `data:image/png;base64,${assignment.assignment_data}` : '',
          assignmentId: assignment.assignment_id,
          assignmentData: assignment.assignment_data
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
  };

  useEffect(() => {
    fetchCounts();
    fetchAssignments();
  }, [studentId]);

  useEffect(() => {
    if (selectedCategory) {
      fetchAssignments(selectedCategory);
    }
  }, [selectedCategory]);

  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  return (
    <>
      <div className="dashboard-student-container">
        <div className="dashboard-greet">
          <h1>Welcome back, Student Name!</h1>
        </div>

        <div className="assignment-container">
          <div className="text-my-assignment">
            <h2>Assignments</h2>
            <ul>
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
                <Link
                  key={index}
                  to={{
                    pathname: `/konva-student/${studentId}/${assignment.assignmentId}`,
                    state: { assignmentData: assignment.assignmentData }
                  }}
                >
                  <img src={assignment.src} alt={`Drawing ${index + 1}`} />
                </Link>
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
