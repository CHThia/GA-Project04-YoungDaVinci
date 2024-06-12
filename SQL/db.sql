-- Create assignments table --
CREATE TABLE assignments (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    drawing_resources_id UUID NOT NULL,
    assignment_data TEXT,
    assignment_status VARCHAR(50),
    feedback TEXT,
    create_date DATE,
    update_date DATE,
    CONSTRAINT assignments_drawing_resources_id_fkey FOREIGN KEY (drawing_resources_id)
        REFERENCES drawing_resources (drawing_resources_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT assignments_student_id_fkey FOREIGN KEY (student_id)
        REFERENCES student_details (student_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- Get assignments table
SELECT a.*, d.title, d.description
FROM assignments a
INNER JOIN drawing_resources d ON a.drawing_resources_id = d.drawing_resources_id
WHERE a.student_id = $1 AND a.assignment_status = $2;

-- Get assignment counts
SELECT 
  SUM(CASE WHEN assignment_status = 'new' THEN 1 ELSE 0 END) AS new,
  SUM(CASE WHEN assignment_status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
  SUM(CASE WHEN assignment_status = 'completed' THEN 1 ELSE 0 END) AS completed,
  COUNT(*) AS all
FROM assignments
WHERE student_id = $1;

-- Get all assignments by student ID
SELECT a.*, d.title, d.description 
FROM assignments a
INNER JOIN drawing_resources d ON a.drawing_resources_id = d.drawing_resources_id
WHERE a.student_id = $1;

--Get assignment by ID
SELECT * FROM assignments WHERE assignment_id = $1;

-- Insert assignments table
INSERT INTO assignments (student_id, drawing_resources_id, assignment_data, assignment_status, feedback, create_date, update_date)
VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
RETURNING *;

-- Update feedback for assignment
UPDATE assignments
SET assignment_data = $1, assignment_status = $2, feedback = $3, update_date = NOW()
WHERE assignment_id = $4 RETURNING *;

-- Update assignment
UPDATE assignments SET assignment_data = $1, assignment_status = $2, update_date = NOW() WHERE assignment_id = $3 RETURNING *;

-- Delete assignments table
DELETE FROM assignments WHERE assignment_id = $1;



-- Create drawing_resources table --
CREATE TABLE drawing_resources (
    drawing_resources_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100),
    description TEXT,
    details BYTEA,
    create_date DATE,
    update_date DATE
);

--Get all drawing resources
SELECT * FROM drawing_resources;

-- Get drawing resource by ID
SELECT * FROM drawing_resources WHERE drawing_resources_id = $1;

-- Insert drawing resource
INSERT INTO drawing_resources (title, description, details, create_date, update_date) 
VALUES ($1, $2, $3, NOW(), NOW()) 
RETURNING *;

-- Update drawing resource
UPDATE drawing_resources 
SET title = $1, description = $2, details = $3, update_date = NOW() 
WHERE drawing_resources_id = $4 
RETURNING *;

-- Delete drawing resource
DELETE FROM drawing_resources WHERE drawing_resources_id = $1;



-- Create logins table -- 
CREATE TABLE logins (
    login_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_email VARCHAR(100),
    teacher_email VARCHAR(100),
    pwd VARCHAR(100),
    isteacher VARCHAR(50),
    create_date DATE,
    update_date DATE,
    CONSTRAINT logins_student_email_fkey FOREIGN KEY (student_email)
        REFERENCES student_details (email)
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT logins_teacher_email_fkey FOREIGN KEY (teacher_email)
        REFERENCES teacher_details (email)
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

-- Insert login 
INSERT INTO logins (student_email, teacher_email, pwd, isteacher, create_date)
VALUES ($1, $2, $3, $4, $5)
RETURNING login_id;

-- Find user by email
SELECT l.*, s.student_id 
FROM logins l
LEFT JOIN student_details s ON l.student_email = s.email
WHERE l.student_email = $1 OR l.teacher_email = $1;



-- Create student_details table -- 
CREATE TABLE student_details (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid() ,
    name VARCHAR(100),
    age INT,
    gender VARCHAR(10),
    education VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    create_date DATE,
    password VARCHAR(100),
    update_pw_date DATE,
    date_of_birth DATE
);

-- Insert student details:
INSERT INTO student_details (name, date_of_birth, gender, education, email, password, create_date, update_pw_date)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING student_id;

-- Get student name
SELECT name 
FROM student_details 
WHERE student_id = $1;

-- Get all students
SELECT student_id, name, age, gender, education, email, 
       to_char(date_of_birth, 'DD-MM-YYYY') as date_of_birth, create_date, update_pw_date 
FROM student_details;

-- Get a student by ID
SELECT student_id, name, age, gender, education, email, 
       to_char(date_of_birth, 'DD-MM-YYYY') as date_of_birth, create_date, update_pw_date 
FROM student_details 
WHERE student_id = $1;

-- Add a new student
INSERT INTO student_details (name, age, gender, education, email, password, create_date, update_pw_date, date_of_birth) 
VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7) 
RETURNING student_id, name, age, gender, education, email, to_char(date_of_birth, 'DD-MM-YYYY') as date_of_birth, create_date, update_pw_date;

-- Update student password (NOT IN USE; FOR FUTURE UPGRADES)
UPDATE student_details 
SET password = $1, update_pw_date = NOW() 
WHERE student_id = $2 
RETURNING student_id, name, age, gender, education, email, to_char(date_of_birth, 'DD-MM-YYYY') as date_of_birth, create_date, update_pw_date;

-- Update student age
UPDATE student_details 
SET age = DATE_PART('year', AGE(date_of_birth));

-- Delete a student profile
DELETE FROM student_details WHERE student_id = $1;



-- Create teacher_details table --
CREATE TABLE teacher_details (
    teacher_id UUID PRIMARY KEY DEFAULT gen_random_uuid() ,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    create_date DATE,
    password VARCHAR(100),
    update_pw_date DATE
);

-- Insert teacher details:
INSERT INTO teacher_details (name, email, password, create_date, update_pw_date)
VALUES ($1, $2, $3, $4, $5)
RETURNING teacher_id;