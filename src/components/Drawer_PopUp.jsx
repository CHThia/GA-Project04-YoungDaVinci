import { useState } from 'react';
import { Drawer, IconButton, Box, Fade, Button, List, ListItem, ListItemText } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';


export default function Drawer_PopUp () {

  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  const addItem = () => {
    const newItem = `Item ${items.length + 1}`;
    setItems([...items, newItem]);
  };

  const drawerContent = (
    <Box
      sx={{ width: 400, padding: 2, display: "flex", flexDirection: "column", overflow: 'auto' }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <h2 className='title'>Assignment Contents</h2>

      <Button
        variant="contained"
        color="warning"
        startIcon={<AddIcon />}
        onClick={addItem}
      >
        Add Assignment
      </Button>
      
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
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
            border: "3px solid #1976d2",
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
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}