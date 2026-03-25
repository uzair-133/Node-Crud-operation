const jwt = require('jsonwebtoken');
// require('dotenv').config(); // Agar server.js mein hai toh theek hai

const ensureAuth = (req, res, next) => {
    const auth = req.headers['authorization'];
    console.log("HEADERS 👉", req.headers);

    if (!auth) {
        return res.status(401).json({ message: "invalid jwt token is" });
    }
    const token = auth.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
        
        req.user = decoded;
        next();
    } catch (err) {
    
        return res.status(401).json({ message: "invalid jwt token issued " });
    }
}

module.exports = ensureAuth;