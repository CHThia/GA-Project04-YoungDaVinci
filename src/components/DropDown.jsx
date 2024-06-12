import { useState, useRef, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


export default function DropDown({ fetchDrawingById, savedDrawings, deleteDrawingById }) {

  const [expanded, setExpanded] = useState(false);
  const accordionRef = useRef(null);
  const scrollContainerRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accordionRef.current && !accordionRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  
  return (
    <Box sx={{ position: 'relative', width: '100%', height: 50, marginBottom: 2 }}>
      <Accordion
        ref={accordionRef}
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{ 
          backgroundColor: '#FDB750',
          position: expanded ? 'absolute' : 'relative', 
          zIndex: 10,
          width: '100%'
        }}
      >
        <AccordionSummary
          sx={{ marginRight: 3 }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={{ fontFamily: 'Helvetica', fontSize: '25px', fontWeight: 'bold', marginLeft: 5 }}>
            Drawing Resources
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ position: 'relative' }}>
          <IconButton
            sx={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
            onClick={scrollLeft}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Box
            ref={scrollContainerRef}
            sx={{ display: 'flex', overflowX: 'hidden', scrollBehavior: 'smooth', paddingLeft: '40px', paddingRight: '40px' }}
          >
            {savedDrawings.map((drawing) => (
              <Box key={drawing.drawing_resources_id} sx={{ position: 'relative', marginRight: 3 }}>
                <IconButton 
                  sx={{
                    position: 'absolute', 
                    top: 15, 
                    right: 15, 
                    zIndex: 1, 
                    color: 'red', 
                    border: '1px solid black',
                    borderRadius: '5px',
                    backgroundColor: 'white',
                    boxShadow: '2px 2px 2px rgba(0,0,0,0.3)',
                  }}
                  onClick={() => deleteDrawingById(drawing.drawing_resources_id)}
                >
                  <DeleteIcon sx={{ fontSize: '20px' }} />
                </IconButton>
                <img 
                  src={`data:image/png;base64,${drawing.details}`} 
                  alt={drawing.title} 
                  style={{ width: 300, height: 200, marginLeft: '25px', paddingBottom: '25px' }} 
                  onClick={() => fetchDrawingById(drawing.drawing_resources_id)}
                />
                <Typography
                  sx={{
                    position: 'absolute',
                    bottom: '15%',
                    left: '57%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    width: '70%',
                    textAlign: 'center',
                    fontFamily: 'helvetica',
                    fontSize: '13px',
                    padding: '2px',
                    borderRadius: '5px'
                  }}
                >
                  {drawing.title}
                </Typography>
              </Box>
            ))}
          </Box>
          <IconButton
            sx={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
            onClick={scrollRight}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}