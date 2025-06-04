import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import camera from '../../images/camera.png';

const HomePage = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
  };

  const captureImage = () => {
    const captured = webcamRef.current.getScreenshot();
    if (!captured) return alert("Failed to capture image.");
    setImageSrc(captured);
  };

  const sendImageToBackend = () => {
    if (!imageSrc) return alert("No image to send.");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        try {
          const response = await axios.post(
            "https://eco-eye.onrender.com/api/v1/capture/upload",
            {
              image: imageSrc,
              location,
            }
          );

          console.log("Image uploaded successfully:", response.data);
          setImageSrc(null);
          navigate('/admin');
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to send image.");
        }
      },
      (error) => {
        alert("Failed to get location.");
        console.error(error);
      }
    );
  };

  return (
    <div className="page-container">
      <header className="header">
        <h1>Eco Eye</h1>
        <p>Report Waste Instantly with Your Camera</p>
      </header>

      <main className="home">
        {!showCamera ? (
          <div className="camera-button" onClick={() => setShowCamera(true)}>
            <img className="cam" src={camera} alt="Open Camera" />
            <p className="instruction-text">Click to open camera and report garbage issue</p>
          </div>
        ) : (
          <div className="webcam">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={640}
              height={480}
              videoConstraints={videoConstraints}
            />

            <div className="btn">
              <button onClick={captureImage}>📸 Capture</button>
              <button onClick={sendImageToBackend}>📤 Send</button>
            </div>

            {imageSrc && (
              <div className="preview">
                <h4>Preview:</h4>
                <img src={imageSrc} alt="Captured" />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 Eco Eye. All rights reserved.</p>
        <p>Contact: support@ecoeye.org</p>
      </footer>
    </div>
  );
};

export default HomePage;
