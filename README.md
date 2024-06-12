
## Young DaVinci (Capstone Project)

Young Davinci is an online drawing platform designed for kids and young teens. The drawing materials are created by the administrator, aka 'Mock Teacher', who will assign the drawing homework to each student based on their age and drawing abilities. In addition, the teacher will monitor the progress of each student's homework and provide feedbacks to help them in their drawing processes or learning journey.

## Reasons to develop this application

I am a regular user of drawing applications like Photoshop, Illustrator etc. For the longest of time, I have always wanted to learn how to code a digital drawing application and to understand the complexity of developing one myself. Thus, this capstone project provided the opportunity. 
During the brainstorming phase, I needed a user story for this project which I was reminded of my children drawing on my ipad time to time. In addition, I have seen my children using e-learning platforms like Class Dojo and Koobits. The experience of it all provide the sparks to my idea and lead to the concept of creating an online drawing platform for young users.

## Wireframe of the application during planning stage
Below is the initial wireframe for this application. Some design layout were adjusted slightly 
during the development phase but general concept remains as it is.

Click link to Figma - 
https://www.figma.com/board/cGHnFhpFbsl6iTgqPnVDhy/GA-Project04-YoungDaVinci-2024?t=5lUVgVXwDrSolOcm-1

<p align="center">
    <img width="650" src="/img_resources/GA-CapstoneProject-Wireframe.PNG">
</p>

## Getting Started
Click on the link to get started -
https://ga-project04-youngdavinci-p79n.onrender.com/

## How to use this application

<h3>Home Page</h3>

Click 'Login' on the navigation bar to display the login form. Existing users will be require to enter their email and password to login. For new users, they have to click the 'Sign Up' and it will route them to another page to register an account.     

<p align="center">
    <img width="650" src="/img_resources/GA-CapstoneProject-Home.PNG">
</p>

<h3>All Students Page (Teacher's Account)</h3>

After an administrator or teacher login, the web application will bring them directly to 'My Students' page where they will see every students registered with Young Davinci. In this page, the user can 'Click to review assignments' of selected student or click on 'Drawing Resources' to create new drawing materials.

<p align="center">
    <img width="650" src="/img_resources/GA-CapstoneProject-Teacher-AllStudents.PNG">
</p>

<h3>Assignment Review Page (Teacher's Account)</h3>

Once a user is in this page, there is a blank canvas with drawing toolbar (left) and a feedback input box (right). To review the selected student's artwork, there is an 'Arrow' icon located at the center right side of the page. Click on it and a Drawer Pop-Up will appear to show the student's assignment(s). Within this Drawer Pop-Up, the user can add new assignments and delete assignments for the student. To give feedback on student's artwork, click on the image and it will populate onto the canvas. Once done, click the 'Send Feedback' to save the update.     

<p align="center">
    <img width="650" src="/img_resources/GA-CapstoneProject-Teacher-ReviewArtwork.PNG">
</p>

<h3>Drawing Resources Page (Teacher's Account)</h3>

Administrator or Teacher need to generate or update their drawing materials for their students. In this page, the user can create new contents on the canvas where they are allowed to import external images onto the canvas, input title and assignment description. Once done, click 'Save' to archive the drawing materials. To review and update, click on the orange bar to show all the saved drawing resources. Select the image and it will populate onto the canvas for the user to update or remove the content accordingly.

<p align="center">
    <img width="650" src="/img_resources/GA-CapstoneProject-Teacher-DrawingResources.PNG">
</p>

<h3>Student Dashboard Page (Student's Account)</h3>

For student login, they will be route to their own student dashboard page where they can review the number of drawing assignments given to them by the administrator / teacher. They can filter through their assignments by clicking the different category (All, New, In Progress and Completed) under the Assignments Box. Each category will indicate a number value to notify the state of the assignments. In addition, student can select on any of the images to enter the drawing canvas page. 

<p align="center">
    <img width="650" src="/img_resources/GA-CapstoneProject-StudentDashboard.PNG">
</p>

<h3>Student Canvas Page (Student's Account)</h3>

In the student's drawing canvas page, users are allow to create their artwork based on the assignment's description (student dashboard page). Once they are done, they can click 'submit' to indicate the completion of their artwork. If a student would like to stop and follow up with the artwork later, they can click the 'save' button. The 'Download' button is an additional feature for student to save their artwork in their own computer.  

<p align="center">
    <img width="650" src="/img_resources/GA-CapstoneProject-StudentCanvas.PNG">
</p>


## My Favourite Code(s)



## Challenges and Key learning Points 
<ul>
  <li> React Sketch Canvas --> React Konva

  <b>Challenges:</b> There was some drawing features not available for React Sketch Canvas and the documentation was pretty limited. Therefore, I have to source for another alternative which i decided to use go for React Konva.
  <b>Key Learning Points:</b> Do testing early. If things are not working out from the start, take courage to explore other alternative as soon as possible.

  <li> 
  <li> 
  <li> 
</ul>

## Application Add-On (next version update)
<ol>
  <li> Create a Main Administrator account that can delegate students for different teachers by education level  
  <li> A standalone account for each teacher to handle students assigned to them (In conjunction to point 1)
  <li> Allow students to upload like profile pictures
  <li> Update of password feature
  <li> Improve the scrolling feature in drawing resources 'Drop Down' (e.g. Drag feature instead of arrows)
  <li> Build layers for the drawing canvas (in reference to Adobe Photoshop)
  <li> Improve or add drawing tools like Shapes, more intuitive control for pencil etc.
  <li> Different canvas dimension

</ol>

## Technologies Used:
<ul>
  <li>PostgreSQL + Neon
  <li>Express
  <li>React + Vite 
  <li>Node JS
  <li>GitHub
  <li>Material UI
  <li>Konva
  <li>React Colorful
  <li>Multer
  <li>Cloudinary (CDN)
</ul>

## Graphic Libraries Used:
<ul>
  <li>Fortawesome
</ul>

## Credit(s)
<ul>
  <li> Freepik (https://www.freepik.com/author/freepik)
  <li> React Konva Crash Course (https://youtu.be/iUm2wHHel4s?si=bowe52oOVAe9j2A7)
  <li> Popover Picker (https://www.npmjs.com/package/react-colorful)  
</ul>
