import { useState, useEffect, useCallback } from 'react';
import { Drawer, IconButton, Box, Fade, Button, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Drawer_PopUp({ studentId, onImageClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawingResources, setDrawingResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [imageDetails, setImageDetails] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Drawing Resources
  useEffect(() => {
    const fetchDrawingResources = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/get-drawing-resources', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch drawing resources');
        }

        const data = await response.json();
        setDrawingResources(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching drawing resources:', error);
        setError('Error fetching drawing resources');
      }
    };

    fetchDrawingResources();
  }, []);

  // Fetch Image Data for Selected Resource
  useEffect(() => {
    if (selectedResource) {
      const fetchImageData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/get-drawing-resources/${selectedResource}`, {
            headers: {
              'x-auth-token': token
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch drawing resource data');
          }

          const data = await response.json();
          setImageSrc(`data:image/png;base64,${data.details}`);
          setImageDetails(data.details);
        } catch (error) {
          console.error('Error fetching drawing resource data:', error);
          setError('Error fetching drawing resource data');
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
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/get-all-assignments/${studentId}`, {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch assignments');
        }

        const data = await response.json();
        setAssignments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setError('Error fetching assignments');
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
      const token = localStorage.getItem('token');
      const response = await fetch('/api/add-new-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
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
      setAssignments((prev) => [...prev, newItem]);
      setSelectedResource('');
      setImageDetails('');
      setImageSrc('');
    } catch (error) {
      console.error('Error adding assignment:', error);
      setError('Error adding assignment');
    }
  }, [selectedResource, studentId, imageDetails]);

  // Delete Assignment
  const deleteAssignment = useCallback(async (assignment_id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/delete/${assignment_id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setAssignments((prev) => prev.filter((assignment) => assignment.assignment_id !== assignment_id));
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError('Error deleting assignment');
    }
  }, []);

  const toggleDrawer = useCallback(
    (open) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      setIsOpen(open);
    },
    []
  );

  // Give Assignment Color Status
  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'red';
      case 'in_progress':
        return '#FFC107';
      case 'completed':
        return 'green';
      default:
        return 'grey';
    }
  };

  const drawerContent = (
    <Box
      sx={{ width: 400, padding: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <h2 className="title">Assignment Contents</h2>

      {error && <Typography color="error">{error}</Typography>}

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
            const imageData = typeof assignment.assignment_data === 'string'
              ? assignment.assignment_data
              : Buffer.from(assignment.assignment_data).toString('base64');

            return (
              <Box 
                key={assignment.assignment_id} 
                sx={{ 
                  position: 'relative', 
                  marginBottom: '30px',
                  padding: '15px',
                  border: '2px solid #ddd', 
                  borderRadius: '5px', 
                  overflow: 'hidden' 
                }}
              >
                <img
                  src={`data:image/png;base64,${imageData}`}
                  alt="Student Assignment"
                  style={{ width: '100%', cursor: 'pointer' }}
                  onClick={() => onImageClick(assignment.assignment_data, assignment.assignment_id)}
                  onError={() => console.error('Invalid image data:', imageData)}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'white',
                    borderRadius: '5px',
                    border: '1px solid black',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '2px 2px 2px rgba(0,0,0,0.2)'
                  }}
                >
                  <IconButton
                    color="error"
                    onClick={() => deleteAssignment(assignment.assignment_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Typography
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    backgroundColor: getStatusColor(assignment.assignment_status),
                    boxShadow: '2px 2px 2px rgba(0,0,0,0.3)',
                    color: 'white',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  {assignment.assignment_status.replace('_', ' ')}
                </Typography>
              </Box>
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