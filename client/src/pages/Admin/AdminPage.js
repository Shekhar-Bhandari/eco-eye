import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './AdminPage.css';

const AdminPage = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get('https://eco-eye.onrender.com/api/v1/capture/all');
        setImages(res.data);
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await axios.delete(`https://eco-eye.onrender.com/api/v1/capture/${id}`);
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  return (
    <div className="admin">
      <h1>Images</h1>
      <div className="images-container">
        {images.map((img) => (
          <div key={img._id} className="card-wrapper">
            <img
              src={img.image}
              alt="Captured"
              className="image-left"
            />

            <div className="info-center">
              <p><strong>Captured At:</strong> {new Date(img.createdAt).toLocaleString()}</p>
              {img.location ? (
                <>
                  <p><strong>Location:</strong></p>
                  <p>Latitude: {img.location.latitude.toFixed(4)}</p>
                  <p>Longitude: {img.location.longitude.toFixed(4)}</p>
                </>
              ) : (
                <p><em>No location data</em></p>
              )}
            </div>

            {img.location && (
              <MapContainer
                center={[img.location.latitude, img.location.longitude]}
                zoom={13}
                scrollWheelZoom={false}
                className="map-right"
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[img.location.latitude, img.location.longitude]}>
                  <Popup>Captured here.</Popup>
                </Marker>
              </MapContainer>
            )}

            <button
              className="delete-button"
              onClick={() => handleDelete(img._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
