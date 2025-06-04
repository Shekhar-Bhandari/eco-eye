
import express from 'express';
import captureModel from '../models/captureModel.js';
import { deleteController } from '../controllers/deleteController.js';

const router = express.Router();

router.get('/all', async (req, res) => {
  try {
    const images = await captureModel.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

router.delete('/:id', deleteController);


export default router;
