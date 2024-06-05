import { useState, useEffect, useCallback } from 'react';
import { Drawer, IconButton, Box, Fade, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

export default function Drawer_PopUp({ studentId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawingResources, setDrawingResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [imageDetails, setImageDetails] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Drawing Resources
  useEffect(() => {
    const fetchDrawingResources = async () => {
      try {
        const response = await fetch('/api/get-drawing-resources'); // Updated endpoint
        const data = await response.json();
        setDrawingResources(data);
      } catch (error) {
        console.error('Error fetching drawing resources:', error);
      }
    };

    fetchDrawingResources();
  }, []);

  // Fetch Image Data for Selected Resource
  useEffect(() => {
    if (selectedResource) {
      const fetchImageData = async () => {
        try {
          const response = await fetch(`/api/get-drawing-resources/${selectedResource}`); // Updated endpoint
          const data = await response.json();
          setImageSrc(`data:image/png;base64,${data.details}`);
          setImageDetails(data.details);
        } catch (error) {
          console.error('Error fetching drawing resource data:', error);
        }
      };

      fetchImageData();
    }
  }, [selectedResource]);

  // Fetch Assignments from student id
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/get-all-assignments/${studentId}`); // Updated endpoint
        const data = await response.json();

        // Convert each assignment data to base64 string if it is not already a string
        const assignmentsWithBase64 = data.map((assignment) => {
          if (assignment.assignment_data && typeof assignment.assignment_data !== 'string') {
            assignment.assignment_data = Buffer.from(assignment.assignment_data).toString('base64');
          }
          return assignment;
        });

        console.log('Fetched assignments with base64 data:', assignmentsWithBase64);
        setAssignments(assignmentsWithBase64);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [studentId]);

  // Add Assignments for student id
  const addItem = useCallback(async () => {
    if (!selectedResource || !imageDetails) return;

    try {
      const response = await fetch('/api/add-new-assignments', { // Updated endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          drawing_resources_id: selectedResource,
          assignment_data: imageDetails,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const newItem = await response.json();
      console.log('New item added:', newItem);
      setAssignments((prev) => [...prev, newItem]);
      setSelectedResource('');
      setImageDetails('');
      setImageSrc('');
      console.log('Assignments added successfully:', newItem);
    } catch (error) {
      console.error('Error adding assignment:', error);
    }
  }, [selectedResource, studentId, imageDetails]);

  const toggleDrawer = useCallback(
    (open) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      setIsOpen(open);
    },
    []
  );

  const drawerContent = (
    <Box
      sx={{ width: 400, padding: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <h2 className="title">Assignment Contents</h2>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Select Drawing Resource</InputLabel>
        <Select
          value={selectedResource}
          onChange={(e) => setSelectedResource(e.target.value)}
        >
          {drawingResources.map((resource) => (
            <MenuItem key={resource.drawing_resources_id} value={resource.drawing_resources_id}>
              {resource.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="warning"
        startIcon={<AddIcon />}
        onClick={addItem}
      >
        Add Assignment
      </Button>

      {imageSrc && (
        <img
          src={imageSrc}
          alt="Selected drawing resource"
          style={{ width: '100%', marginBottom: '16px' }}
        />
      )}

      {!loading && assignments.length > 0 && (
        <Box sx={{ marginTop: 2 }}>
          {assignments.map((assignment) => {
            console.log('Assignment data:', assignment.assignment_data);
            return (
              <img
                key={assignment.assignment_id}
                src={`data:image/png;base64,${assignment.assignment_data}`}
                alt="Student Assignment"
                style={{ width: '100%', marginBottom: '16px' }}
                onError={() => console.error('Invalid image data:', assignment.assignment_data)}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <Fade in={!isOpen}>
        <IconButton
          sx={{
            position: 'fixed',
            top: '50%',
            right: 16,
            transform: 'translateY(-50%)',
            zIndex: 1300,
            border: '3px solid #1976d2',
          }}
          color="primary"
          onClick={toggleDrawer(true)}
        >
          <ArrowBackIcon />
        </IconButton>
      </Fade>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            top: '10%',
            right: '2%',
            height: '85%',
            borderRadius: '10px',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}