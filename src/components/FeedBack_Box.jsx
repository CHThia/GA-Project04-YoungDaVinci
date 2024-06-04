import { TextField, Button, Box } from '@mui/material';
import { useState } from 'react';

export default function FeedbackBox() {
  const [text, setText] = useState('');

  const handleSave = () => {
    // Code Logic
    console.log('Saved Mock Text:', text);
    setText('');
  };

  return (
    <>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>

        <TextField
          id="outlined-basic"
          label="Enter feedback"
          variant="outlined"
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline 
          rows={4} 
          fullWidth
          sx={{ width: 1080 }}
        />
        
        <br/>

        <Button variant="contained" color="primary" onClick={handleSave}>
          Send Feedback
        </Button>

      </Box>
    </>
  );
}
