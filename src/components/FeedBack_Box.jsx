import { TextField, Button, Box } from '@mui/material';
import { useState } from 'react';

export default function FeedbackBox({ assignmentId, drawingState }) {
  const [text, setText] = useState('');

  const handleSave = async () => {
    const feedbackData = {
      feedback: text,
      assignment_data: drawingState,
      assignment_id: assignmentId
    };

    try {
      const response = await fetch(`/api/update-feedback/${assignmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        console.log('Feedback and drawing state saved successfully');
        setText('');
      } else {
        console.error('Failed to save feedback and drawing state');
      }
    } catch (error) {
      console.error('Error saving feedback and drawing state:', error);
    }
  };

  return (
    <div className='feedback-review'>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          id="outlined-basic"
          label="Enter feedback"
          variant="outlined"
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          rows={11.6}
          fullWidth
          sx={{ width: 400 }}
        />
        <br/>
        <br/>
        <br/>
        <Button className="button-delete" variant="contained" color="primary" onClick={handleSave}>
          Send Feedback
        </Button>
      </Box>
    </div>
  );
}