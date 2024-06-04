import { useState, useEffect, useCallback } from 'react';
import { Drawer, IconButton, Box, Fade, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

export default function Drawer_PopUp({ studentId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawingResources, setDrawingResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState('');
  const [imageSrc, setImageSrc] = useState('');


  useEffect(() => {
    const fetchDrawingResources = async () => {
      try {
        const response = await fetch('/api/get-drawing-resources');
        const data = await response.json();
        setDrawingResources(data);
      } catch (error) {
        console.error('Error fetching drawing resources:', error);
      }
    };

    fetchDrawingResources();
  }, []);

  
  useEffect(() => {
    if (selectedResource) {
      const fetchImageData = async () => {
        try {
          const response = await fetch(`/api/get-drawing-resources/${selectedResource}`);
          const data = await response.json();
          setImageSrc(`data:image/png;base64,${data.details}`);
        } catch (error) {
          console.error('Error fetching drawing resource data:', error);
        }
      };

      fetchImageData();
    }
  }, [selectedResource]);


  const addItem = useCallback(async () => {
    if (!selectedResource) return;

    try {
      const response = await fetch('/api/add-new-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          drawing_resources_id: selectedResource,
          assignment_data: 'New assignment data', // Replace with actual assignment data
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const newItem = await response.json();
      setImageSrc('');
      setSelectedResource('');
      console.log('Assignments added successfully:', newItem);
    } catch (error) {
      console.error('Error adding assignment:', error);
    }
  }, [selectedResource, studentId]);


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
          style={{ width: '100%' }}
        />
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
