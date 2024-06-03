import { Container } from "@mui/material"
import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import CardActions from '@mui/joy/CardActions';
import Typography from '@mui/joy/Typography';
import { useNavigate } from "react-router-dom";


export default function StudentCard () {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('./studentartworks')
  }
  
  return (
    <Container>
      <Card
      sx={{
        width: 320,
        maxWidth: '100%',
        boxShadow: 'lg',
      }} >
      <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>

        <Avatar src="/static/images/avatar/1.jpg" sx={{ '--Avatar-size': '8rem' }} />

        <Typography level="title-lg">Enya Thia</Typography>

        <Typography level="body-sm" sx={{ maxWidth: '24ch' }}>
          Age <br/> Education Level <br/> School
        </Typography>
        
      </CardContent>
      
      <CardOverflow sx={{ bgcolor: 'background.level1' }}>
        <CardActions buttonFlex="1">
          <ButtonGroup variant="outlined" sx={{ bgcolor: 'background.surface' }}>
            <Button onClick={handleButtonClick}>
              Click to review assignments
            </Button>
          </ButtonGroup>
        </CardActions>
      </CardOverflow>

      </Card>
    </Container>
  )
}