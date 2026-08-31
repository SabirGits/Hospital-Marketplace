const jwt = require("jsonwebtoken");

// Reads "Authorization: Bearer <token>", verifies it, and attaches the
// decoded payload to req.user. Every protected route goes through this first.
function verifyToken(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

// Use after verifyToken on routes only admins should reach.
function requireAdmin(req, res, next) {
    if (req.user?.type !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
}

module.exports = { verifyToken, requireAdmin };
