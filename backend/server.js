import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import uploadRoutes from "./routes/uploadRoutes.js";
import generateRoutes from "./routes/generateRoutes.js";

// Load environment variables FIRST
dotenv.config(); 

// App Config
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/generate", generateRoutes);

// API Endpoints
app.get('/', (req, res) => {
    res.send("server running");
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port: ${port}`);
});
