import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const HomePage = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

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

    // Get user location first
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        try {
          const response = await axios.post(
            "http://localhost:8080/api/v1/capture/upload",
            {
              image: imageSrc,
              location,
            }
          );

          console.log("Image uploaded successfully:", response.data);
          alert("Image sent to backend!");
          setImageSrc(null); // Optionally clear the preview after sending
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
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        height={480}
        videoConstraints={videoConstraints}
      />

      <div>
        <button onClick={captureImage}>Capture</button>
        <button onClick={sendImageToBackend}>Send</button>
      </div>

      {imageSrc && (
        <div>
          <h4>Preview:</h4>
          <img
            src={imageSrc}
            alt="Captured"
            style={{ width: '320px', marginTop: '10px' }}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
