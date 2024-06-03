import { useEffect, useState, useCallback } from 'react';

export default function Dashboard() {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssignments = async (category) => {
    setLoading(true);
    setError(null);

    const baseUrl = 'http://localhost:3000/api';
    const urlMap = {
      new: `${baseUrl}/new`,
      in_Progress: `${baseUrl}/in-progress`,
      completed: `${baseUrl}/drawings`,
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
              <li><a href="#new" onClick={() => handleCategoryClick('new')}>New</a></li>
              <li><a href="#in-progress" onClick={() => handleCategoryClick('in_Progress')}>In Progress</a></li>
              <li><a href="#completed" onClick={() => handleCategoryClick('completed')}>Completed</a></li>
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
