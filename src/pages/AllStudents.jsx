import SearchBox from "../components/SearchBox"
import StudentCard from "../components/StudentCard"


export default function AllStudents () {


  const handleSearch = () => {
    // Code Logic
    console.log("Mock query is working")
  }

  return(
    <>
      <div className="my-student-container">
        <h1>My Students</h1>
        <SearchBox onSearch={handleSearch} />
      </div>

      <div className="student-list-container">
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
      </div>



    </>
  )
}