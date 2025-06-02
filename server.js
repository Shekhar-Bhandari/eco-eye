import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import connectDB from "./config/db.js";  

// env config
dotenv.config();

// DB CONNECTION
connectDB();

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// routes
import userRoute from "./routes/userRoute.js";
import {  uploadRoute } from "./routes/uploadRoute.js";
import router from "./routes/getAllRoute.js";

app.use("/api/v1/user", userRoute);
app.use("/api/v1/capture",uploadRoute);
app.use('/api/v1/capture', router); 
app.use('/api/v1/capture', router); 


// port
const PORT = process.env.PORT || 8000;

// listen
app.listen(PORT, () => {
  console.log(
    `Node Server Running on ${process.env.DEV_MODE} mode on Port no ${PORT}`.bgMagenta
  );
});
