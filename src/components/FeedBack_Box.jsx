import { TextField, Button, Box } from '@mui/material';
import { useState } from 'react';

export default function FeedbackBox({ assignmentId, stageRef }) {
  
  const [text, setText] = useState('');

  const handleSave = async () => {

    // Convert canvas to base64
    const dataURL = stageRef.current.toDataURL();
    const updatedDrawingState = dataURL.split(',')[1]; // Extract base64 string

    const feedbackData = {
      feedback: text,
      assignment_data: updatedDrawingState,
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
        <br />
        <Button
          className="button-delete"
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          Send Feedback
        </Button>
      </Box>
    </div>
  );
}