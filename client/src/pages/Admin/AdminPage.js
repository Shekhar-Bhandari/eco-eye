import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

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

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await axios.delete(`/api/v1/capture/${id}`);
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  return (
    <div>
      <h1>Captured Images</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {images.map((img) => (
          <div
            key={img._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: 10,
              width: 500,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={img.image}
                alt="Captured"
                style={{ width: 200, height: 200, objectFit: 'cover', marginRight: 15 }}
              />
              <div>
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
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(img._id)}
                  style={{
                    marginTop: 10,
                    padding: '6px 12px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            {img.location && (
              <MapContainer
                center={[img.location.latitude, img.location.longitude]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: 200, marginTop: 10, borderRadius: 8 }}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
