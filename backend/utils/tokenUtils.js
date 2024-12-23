import jwt from "jsonwebtoken";
import pool from "../config/db.js";  // Assuming your DB connection is set up here
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];  // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Check if the token is blacklisted
    const result = await pool.query("SELECT * FROM token_blacklist WHERE token = $1", [token]);
    if (result.rows.length > 0) {
      return res.status(401).json({ error: "Token is invalidated. Please login again." });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add user data to request object
    next();  // Continue to the next middleware or route handler
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(400).json({ error: "Invalid token." });
  }
};
