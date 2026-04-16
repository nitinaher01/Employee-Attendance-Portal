const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    // 1. Check if the request has an Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // 2. The token usually looks like "Bearer eyJhbGciOi..." so we remove "Bearer "
        const token = authHeader.replace('Bearer ', '');
        
        // 3. Verify the token. If it is older than 15 minutes, this will instantly throw an error!
        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. If valid, attach the user info (like id) to the request so the next function can use it
        req.user = verifiedUser; 
        next(); // The bouncer lets them through!
    } catch (error) {
        res.status(401).json({ message: "Session expired. Please log in again." });
    }
};

module.exports = verifyToken;