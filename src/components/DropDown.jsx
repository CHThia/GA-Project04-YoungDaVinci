import { useState, useRef, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export default function DropDown({ savedDrawings, fetchDrawingById }) {

  const [expanded, setExpanded] = useState(false);
  const accordionRef = useRef(null);
  
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


  return (
    <>
      <Box sx={{ width: '100%', marginBottom: 2 }}>
        <Accordion
          ref={accordionRef}
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          sx={{ backgroundColor: '#FDB750' }}
        >
          <AccordionSummary sx={{ marginRight: 3 }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography sx={{ fontFamily: 'Helvetica', fontSize: '20px', fontWeight: 'bold', marginLeft: 2 }}>
              Drawing Resources
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', overflowX: 'auto' }}>
              {savedDrawings.map((drawing) => (
                <Box key={drawing.drawing_resources_id} sx={{ marginRight: 1 }} onClick={() => fetchDrawingById(drawing.drawing_resources_id)}>
                  <img src={`data:image/png;base64,${drawing.details}`} alt={drawing.title} style={{ width: 150, height: 150, padding: '15px' }} />
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
    </Box>
    </>
  );
}