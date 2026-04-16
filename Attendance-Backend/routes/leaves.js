const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const verifyToken = require('../middleware/auth');

// POST /api/leaves
router.post('/', verifyToken, async (req, res) => {
    try {
        const employeeId = req.user.id;
        const { start_date, end_date, type, reason } = req.body;
        console.log("BACKEND RECEIVED:", req.body);

        if (!start_date || !end_date || !type || !reason) {
            return res.status(400).json({ message: "Ghost: All fields are required" });
        }

        const newLeave = await Leave.create({
            employee_id: employeeId,
            start_date,
            end_date,
            type,
            reason,
            status: 'Pending'
        });

        res.json({ message: "Leave request submitted successfully!", leave: newLeave });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error submitting leave request" });
    }
});

// GET /api/leaves
router.get('/', verifyToken, async (req, res) => {
    try {
        const employeeId = req.user.id;

        const leaves = await Leave.findAll({
            where: { employee_id: employeeId },
            order: [['created_at', 'DESC']] 
        });

        res.json(leaves);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching leave requests" });
    }
});

module.exports = router;