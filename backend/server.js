import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js';
import uploadRoutes from "./routes/uploadRoutes.js";
import generateRoutes from "./routes/generateRoutes.js";

// App Config
const app = express()
const port = process.env.PORT || 5000
dotenv.config();
connectDB()

// middlewares
app.use(express.json())
app.use(cors())

// api routes
app.use("/api/upload", uploadRoutes);
app.use("/api/generate", generateRoutes);


// api endpoints
app.get('/',(req,res)=>{
    res.send("server running")
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port: ${port}`);
});