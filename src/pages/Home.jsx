import { Typography, Container, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import Carousel from 'react-material-ui-carousel';


export default function HomePage() {

  const items = [
    {
      image: "https://res.cloudinary.com/dl2tqmq2x/image/upload/v1718085914/carousel_001_hpwosb.png",
    },
    {
      image: "https://res.cloudinary.com/dl2tqmq2x/image/upload/v1718085914/carousel_002_woq3ls.png",
    },
    {
      image: "https://res.cloudinary.com/dl2tqmq2x/image/upload/v1718085914/carousel_003_msiorl.png",
    }
  ];

  // Adjust the carousel dots
  const customContainerStyle = {
    position: 'absolute',
    bottom: '60px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  };

  
  return (
    <div style={{ backgroundColor: '#f6d959', borderRadius: '20px' }}>

      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        useKeyboardArrows
        autoPlay
        interval={3000}
        transitionTime={0}
        swipeable={false}
        swipe={false}
        indicatorContainerProps={{ style: customContainerStyle }}
      >
        {items.map((item, index) => (
          <Box key={index}
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1.5%',
              height: 400
            }}>
            <img
              src={item.image}
              alt={`slide-${index}`}
              style={{
                width: '1150px',
                height: '350px',
                objectFit: 'cover',
                border: '7px solid white',
                borderRadius: '20px',
                boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.5)'
              }}
            />
          </Box>
        ))}
      </Carousel>

      <Container 
        maxWidth="md" 
        sx={{ 
          my: 4, 
          textAlign: 'center', 
          padding: '20px',
        }}
      >
        <Typography 
          variant="h4" 
          sx={{
            color: '#191919',
            fontSize: '50px',
            fontFamily: 'helvetica',
            fontWeight: 'bold', 
            paddingBottom: '5px',
          }}
        >
          Welcome to Young DaVinci
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#424242',
            margin: 'auto', 
            textAlign: 'justify',
            lineHeight: '1.6',  
            padding: '20px',
            fontSize: '20px',
            fontFamily: 'helvetica',
          }}
        >
          <b>Young DaVinci</b> is an online drawing platform designed specifically for kids and young teens who are eager to learn and enhance their sketching, drawing, and painting skills. Our mission is to nurture creativity and imagination through fun and engaging art lessons. Each drawing assignment is thoughtfully curated by our experienced teachers to help young artists grow and excel in their artistic journey. Join us at Young Da Vinci and let your creativity soar!
        </Typography>
      </Container>

      <Container sx={{ paddingBottom:'5%' }}>
        <Grid container spacing={10}>
          <Grid item xs={12} sm={6} md={4}>
            
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="https://res.cloudinary.com/dl2tqmq2x/image/upload/v1718093134/card-image_001_r1lhru.png"
                alt="Card Image 1"
              />
              <CardContent sx={{ backgroundColor:'#404040', color:'white' }}>
                <Typography variant="h5">Holiday Trip</Typography>
                <br/>
                <Typography variant="body2">
                  Artwork done by: Selina Kyle
                </Typography>
                <Typography variant="body2">
                 Age: 9 years old 
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="https://res.cloudinary.com/dl2tqmq2x/image/upload/v1718093134/card-image_003_kcldjn.png"
                alt="Card Image 2"
              />
              <CardContent sx={{ backgroundColor:'#404040', color:'white' }}>
              <Typography variant="h5">Daisy</Typography>
              <br/>
                <Typography variant="body2">
                  Artwork done by: Joshua Tan 
                </Typography>
                <Typography variant="body2">
                 Age: 7 years old 
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="https://res.cloudinary.com/dl2tqmq2x/image/upload/v1718093133/card-image_002_gpyoo6.png"
                alt="Card Image 3"
              />
              <CardContent sx={{ backgroundColor:'#404040', color:'white' }}>
                <Typography variant="h5">Happy Day</Typography>
                <br/>
                <Typography variant="body2">
                  Artwork done by: Wendy Tan 
                </Typography>
                <Typography variant="body2">
                 Age: 6 years old 
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </div>
  );
}