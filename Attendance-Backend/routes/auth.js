const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Employee = require('../models/Employee');

// POST /api/setup
router.post('/setup', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('pass@321', salt);
        
        const newEmployee = await Employee.create({
            username: 'nitin01', 
            password_hash: hashedPassword
        });
        
        res.json({ message: "Test user created successfully!", user: newEmployee.username });
    } catch (error) {
        res.status(500).json({ error: "User already exists or database error." });
    }
});

// POST /api/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const employee = await Employee.findOne({ where: { username } });
        if (!employee) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, employee.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: employee.id, username: employee.username },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } 
        );

        res.json({ message: "Login successful", token, username: employee.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login" });
    }
});

module.exports = router;