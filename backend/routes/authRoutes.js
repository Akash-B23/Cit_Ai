import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../config/db.js"; // Assuming this is your database connection
import dotenv from "dotenv";
import { verifyToken } from "../utils/tokenUtils.js"; // Importing the token verification middleware

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// User Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    // Log the token to ensure it's being generated
    console.log("Generated token:", token);  // Log the token here

    // Send the token in the response
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// User Logout Route (with Token Verification)
router.post("/logout", verifyToken, async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

  try {
    // Add token to blacklist in the database (making it invalid)
    await pool.query("INSERT INTO token_blacklist (token) VALUES ($1)", [token]);

    res.status(200).json({ message: "Logout successful. Token invalidated." });
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
