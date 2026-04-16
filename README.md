# Employee-Attendance-Portal
A full-stack Employee Attendance Portal designed to manage daily attendance and leave requests. This application features secure login, daily check-in/out tracking, automated total hours calculation, and a comprehensive leave management system.

🚀 Tech Stack
Frontend: React.js 
Backend: Node.js with Express.js 
Database: PostgreSQL (Neon) with Sequelize ORM 
Authentication: JWT (JSON Web Token) with a strict 15-minute inactivity timeout 

📋 Features

Secure Authentication: User login with session management; unauthorized or expired requests are redirected to login.

Daily Attendance: Mark check-in and check-out times. The system prevents multiple check-ins on the same calendar day.

Timesheet History: Browse attendance records with total hours worked and date range filtering.

Leave Management: Submit leave applications (start date, end date, type, reason) and track their status.

🛠️ Setup Instructions
1. Database Setup (Neon PostgreSQL)
Create a new project in your Neon console. 

Run the provided database.sql script in the Neon SQL Editor. 

This script creates the Employees, Attendance, and Leaves tables.

It applies a unique constraint for daily check-ins and seeds the initial test user. 

2. Backend Configuration
Navigate to the /attendance-backend directory.

Create a .env file and provide your database credentials and JWT secret: 

Code snippet
DB_NAME=your_neon_db_name
DB_USER=your_neon_db_user
DB_PASS=your_neon_db_password
DB_HOST=your_neon_db_endpoint
JWT_SECRET=your_secret_key_here
PORT=5000
Install dependencies and start the server: 

Bash
npm install
node index.js
3. Frontend Configuration
Navigate to the /attendance-frontend directory.

Install dependencies and start the React development server: 

Bash
npm install
npm run dev
🔑 Test Credentials
Use the following seeded account to test the portal immediately:
Username: nitin01
Password: pass@321

📁 Project Structure 

/Attendance-Frontend: React.js source code.

/Attendance-Backend: Node.js API and Sequelize migration files.

database.sql: Full schema setup and initial data seeding.
