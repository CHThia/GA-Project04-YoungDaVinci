import { useEffect, useState } from 'react'
import { Container, Grid } from '@mui/material';
import SearchBox from "../components/SearchBox"
import StudentCard from "../components/StudentCard"


export default function AllStudents () {

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/get-all-students', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }

        const data = await response.json();
        setStudents(Array.isArray(data) ? data : []);
      } catch (error) {
        setError('Error fetching students');
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Search for student by name
  const handleSearch = (term) => {
    setSearchTerm(term);
    console.log("SearchBox is working")
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return(
    <>
      <div className='all-students-container'>
        
        <Container>

          <h1>My Students</h1>

          <SearchBox onSearch={handleSearch} />

          <Grid container spacing={5} mt={3}>
            {filteredStudents.map(student => (
              <Grid item xs={12} sm={6} md={4} key={student.student_id}>
                <StudentCard student={student} />
              </Grid>
            ))}
          </Grid>
          
        </Container>

      </div>
    </>
  )
}
