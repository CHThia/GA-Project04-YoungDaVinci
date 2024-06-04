import { useEffect, useState } from 'react'
import { Container, Grid } from '@mui/material';
import SearchBox from "../components/SearchBox"
import StudentCard from "../components/StudentCard"


export default function AllStudents () {

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/get-all-students');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    console.log("SearchBox is working")
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return(
    <>
       <Container>
      <h1 style={{ textAlign: 'center' }}>My Students</h1>
      <SearchBox onSearch={handleSearch} />
      <Grid container spacing={3} mt={3}>
        {filteredStudents.map(student => (
          <Grid item xs={12} sm={6} md={4} key={student.student_id}>
            <StudentCard student={student} />
          </Grid>
        ))}
      </Grid>
    </Container>
    </>
  )
}