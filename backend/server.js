import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import semesterRoutes from "./routes/semesterRoutes.js";
import creditsDisplayRoutes from "./routes/creditsDisplayRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/", semesterRoutes);
app.use("/api", creditsDisplayRoutes);
app.use("/auth", authRoutes);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


