import express from "express";


 import captureModel from "../models/captureModel.js";
import uploadController from '../controllers/uploadController.js'

const uploadRoute = express.Router();
// POST /api/v1/capture/upload
uploadRoute.post("/upload",uploadController );



export{ uploadRoute};
