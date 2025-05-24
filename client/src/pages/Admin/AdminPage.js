import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get('/api/v1/capture/all');
        setImages(res.data);
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h1>Captured Images</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {images.map((img) => (
          <div 
            key={img._id} 
            style={{ 
              margin: 10, 
              display: 'flex', 
              alignItems: 'center', 
              border: '1px solid #ccc', 
              padding: 10,
              borderRadius: 8,
              width: 450
            }}
          >
            <img
              src={img.image}
              alt="Captured"
              style={{ width: 200, height: 200, objectFit: 'cover', marginRight: 15 }}
            />
            <div>
              <p><strong>Captured At:</strong> {new Date(img.createdAt).toLocaleString()}</p>
              {img.location ? (
                <p>
                  <strong>Location:</strong><br />
                  Latitude: {img.location.latitude.toFixed(4)} <br />
                  Longitude: {img.location.longitude.toFixed(4)}
                </p>
              ) : (
                <p><em>No location data</em></p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
