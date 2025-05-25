import express from "express";
 // note the .js extension
 import captureModel from "../models/captureModel.js";
import uploadController from '../controllers/uploadController.js'
const uploadRoute = express.Router();
const deleteRoute=express.Router()
// POST /api/v1/capture/upload
uploadRoute.post("/upload",uploadController );
// DELETE /api/v1/capture/:id


export{ deleteRoute ,uploadRoute};
