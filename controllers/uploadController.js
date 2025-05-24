import captureModel from '../models/captureModel.js';

const uploadController = async (req, res) => {
  try {
    const { image, location } = req.body;

    if (!image) return res.status(400).json({ error: 'Image is required' });

    const newCapture = new captureModel({
      image,
      location: location ? {
        latitude: location.latitude,
        longitude: location.longitude,
      } : undefined,
    });

    await newCapture.save();
    res.status(201).json(newCapture);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image with location' });
  }
};

export default uploadController;
