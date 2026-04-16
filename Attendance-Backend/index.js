const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');

// Import Route Files
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leaves');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register Routes
// Notice how this maps the base URLs to the specific router files
app.use('/api', authRoutes); 
app.use('/api/attendance', attendanceRoutes); 
app.use('/api/leaves', leaveRoutes); 

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});