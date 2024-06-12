
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


## Favourite Component 

The "Drawer_PopUp" component, in my own opinion, provided the most rewarding experience I can have in this project. At the back of my mind, I would consider this segment of the coding as a 'Bus Terminal'. 

<li> The flow started with the 'Student Card' from the All Students Page.

<p align="center">
    <img width="600" src="/img_resources/Fav-Code-AllStudents-01.PNG">
</p>

<li> Checking if student id is pass down accordingly

<p align="center">
    <img width="600" src="/img_resources/Fav-Code-StudentCard-02.PNG">
</p>

<p align="center">
    <img width="600" src="/img_resources/Fav-Code-StudentCard-02a.PNG">
</p>

<li> Fetching Drawing Resource from Blob to base64

<p align="center">
    <img width="600" src="/img_resources/Fav-Code-StudentCard-02b.PNG">
</p>

<li> Passing the student id and fetch assignments belong to this student

<p align="center">
    <img width="600" src="/img_resources/Fav-Code-Drawer_PopUp-03.PNG">
</p>

<li> Clone the selected drawing assignment for the student so that the original state of the drawing resource will not be manipulated.

<p align="center">
    <img width="600" src="/img_resources/Fav-Code-Drawer_PopUp-04.PNG">
</p>

<li> Coordinate the data type for assignments. Initially, I set both to be 'BYTEA' which was a mistake. 

<p align="center">
    <img width="500" src="/img_resources/Fav-SQL-DrawResource-05.PNG">
</p>

<p align="center">
    <img width="500" src="/img_resources/Fav-SQL-Assignments-06.PNG">
</p>

## Challenges and Key learning Points 
<ul>
  <li> React Sketch Canvas --> React Konva
    <ul>
      <li><b>Challenges:</b> There was some drawing features not available for React Sketch Canvas and the documentation was pretty limited. Therefore, I have to source for another alternative which i decided to use go for React Konva.
      <li><b>Key Learning Points:</b> Do testing early. If things are not working out from the start, take courage to explore other alternative as soon as possible.
    </ul>
</ul>
      
<ul>
  <li> Convert images to blob and base64
    <ul>
      <li><b>Challenges:</b> At the start, I created the drawing canvas to be 1080px by 720px. Generally it works normally if I only draw with line art and save the blob into the database. However, if I upload an external image file into the canvas, it will indicate payload is too large. The only way that I solve it was by reducing the canvas size to 500px by 300px.
      <li><b>Key Learning Points:</b> When dealing with large image files, its good to use content delivery network (CDN). 
    </ul>
</ul>

   
<ul>
  <li> Data Structure
    <ul>
      <li><b>Challenges:</b> The right idea but different results. During the project, there was alot of back and forth with the SQL Tables despite designing how I want the data to flow or retrieve or update. One of the most significant case I encounter was the assigning of drawing materials to students. The SQL tables related in this situation was 'Drawing_Resources' and 'Assignments'. The concept was to take the original drawing resources (blob) and duplicate it for the student(s). So I thought the data type has to be blob between the 2 tables. However, I was actually wrong as I forgotten the student's version has been encoded to Base64 which is a string data.
      <li><b>Key Learning Points:</b> From this experience, I think its good to draw out how the data structures flows despite doing it in excel and understand what type data are converted during certain processes. Also, its ok to drop the tables and restart again as PostgreSQL does not have certain features like shifting columns etc.
    </ul>
</ul>

<ul>
  <li> Error message and console logging
  <ul>
    <li><b>Challenges:</b> Although it may look simple in some pages of the web application, it will get pretty confusing when it needs to fetch, update or delete certain parts of the data from different tables to get the results needed. In situation like this, errors are bound to happen and to be honest, I have spent hours resolving it. 
    <li><b>Key Learning Points:</b> I learnt not to be so fearful when seeing error message. During this project especially, I started to be able to understand the problem better due to pass experience or seeing the same repetitive error messages. When I have a hard time solving it, I will try to slot in more console log to investigate the problem until i understand the issue. Although its time consuming, resolving the problem is like a level up and allow me to understand what happen so that i will not make the same mistakes.
  </ul>
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
