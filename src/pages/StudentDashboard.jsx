import { useEffect, useState, useCallback } from 'react';

export default function StudentDashboard() {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({ new: 0, in_Progress: 0, completed: 0 });

  //* Replace with the actual student ID from authentication context
  const studentId = '11111111-1111-1111-1111-111111111111'; 

  const fetchCounts = async () => {
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
    setLoading(true);
    setError(null);

    const baseUrl = `/api/get-all-assignments/${studentId}`;
    const urlMap = {
      new: `${baseUrl}/new`,
      inProgress: `${baseUrl}/in_progress`,
      completed: `${baseUrl}/completed`,
    };

    const url = urlMap[category];

    if (!url) {
      console.error('Invalid category');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        const imageList = await response.json();
        setImages(imageList);
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
  }, []);

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
              <li><a href="#in-progress" onClick={() => handleCategoryClick('in_Progress')}>In Progress ({counts.in_progress})</a></li>
              <li><a href="#completed" onClick={() => handleCategoryClick('completed')}>Completed ({counts.completed})</a></li>
            </ul>
          </div>

          <div className="review-assignment">
            {loading ? (
              <p>Loading images...</p>
            ) : error ? (
              <p>{error}</p>
            ) : images.length > 0 ? (
              images.map((src, index) => (
                <img key={index} src={src} alt={`Drawing ${index + 1}`} />
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
