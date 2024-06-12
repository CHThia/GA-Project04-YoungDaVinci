import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


export default function SearchBox ({ onSearch }) {

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(event.target.value);
    }
  };

  
  return (
    <>
      <TextField
        variant="outlined"
        placeholder="Student Name"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        style={{ 
          width: '40%', 
          marginLeft: '2%', 
          backgroundColor:'white', 
          borderRadius:'5px',
          boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.3)',
         }}
        onKeyDown={handleKeyPress}
      />
    </>
  )
}