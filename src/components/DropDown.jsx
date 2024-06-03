import { useState, useRef, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const contents = [
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150',
];

export default function DropDown() {

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
            {contents.map((src, index) => (
              <Box key={index} sx={{ marginRight: 1 }}>
                <img src={src} alt={`Image ${index + 1}`} style={{ width: 150, height: 150, padding: '15px' }} />
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}