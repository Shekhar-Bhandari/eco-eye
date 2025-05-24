import express from "express";
import CapturedImage from '../models/captureModel.js'; // note the .js extension
import uploadController from '../controllers/uploadController.js'
const uploadRoute = express.Router();

// POST /api/v1/capture/upload
uploadRoute.post("/upload",uploadController );

export default uploadRoute;
