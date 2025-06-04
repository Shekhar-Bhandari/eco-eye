import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import camera from '../../images/camera.png';

const HomePage = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null); // 'granted', 'denied', 'prompt', null
  const [locationPermission, setLocationPermission] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionError, setPermissionError] = useState('');
  const navigate = useNavigate();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
  };

  // Check permissions on component mount
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    // Check camera permission
    try {
      const cameraStatus = await navigator.permissions.query({ name: 'camera' });
      setCameraPermission(cameraStatus.state);
      
      // Listen for permission changes
      cameraStatus.onchange = () => {
        setCameraPermission(cameraStatus.state);
      };
    } catch (error) {
      console.log('Camera permission check not supported');
    }

    // Check location permission
    try {
      const locationStatus = await navigator.permissions.query({ name: 'geolocation' });
      setLocationPermission(locationStatus.state);
      
      // Listen for permission changes
      locationStatus.onchange = () => {
        setLocationPermission(locationStatus.state);
      };
    } catch (error) {
      console.log('Location permission check not supported');
    }
  };

  const requestPermissions = async () => {
    setPermissionError('');
    setShowPermissionModal(true);

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream after getting permission
      setCameraPermission('granted');
      
      // Request location permission
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission('granted');
          setShowPermissionModal(false);
          setShowCamera(true);
        },
        (error) => {
          console.error('Location permission denied:', error);
          setLocationPermission('denied');
          setPermissionError('Location access is required to report waste issues. Please enable location in your browser settings.');
        }
      );
    } catch (error) {
      console.error('Camera permission denied:', error);
      setCameraPermission('denied');
      setPermissionError('Camera access is required to capture images. Please enable camera in your browser settings.');
    }
  };

  const handleCameraClick = () => {
    if (cameraPermission === 'denied' || locationPermission === 'denied') {
      setShowPermissionModal(true);
      setPermissionError('Please enable camera and location permissions to use this feature.');
      return;
    }

    if (cameraPermission !== 'granted' || locationPermission !== 'granted') {
      requestPermissions();
    } else {
      setShowCamera(true);
    }
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
        alert("Failed to get location. Please ensure location services are enabled.");
        console.error(error);
      }
    );
  };

  const closePermissionModal = () => {
    setShowPermissionModal(false);
    setPermissionError('');
  };

  const openBrowserSettings = () => {
    alert('To enable permissions:\n\n1. Click the camera/location icon in your browser\'s address bar\n2. Select "Allow" for both camera and location\n3. Refresh the page if needed\n\nFor Chrome: chrome://settings/content\nFor Firefox: about:preferences#privacy');
  };

  return (
    <div className="page-container">
      <header className="header">
        <h1>Eco Eye</h1>
        <p>Report Waste Instantly with Your Camera</p>
      </header>

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="permission-modal-overlay">
          <div className="permission-modal">
            <h3>Permissions Required</h3>
            <div className="permission-content">
              <div className="permission-item">
                <span className="permission-icon">📷</span>
                <div>
                  <strong>Camera Access</strong>
                  <p>Required to capture images of waste</p>
                  <span className={`permission-status ${cameraPermission}`}>
                    {cameraPermission === 'granted' ? '✅ Granted' : 
                     cameraPermission === 'denied' ? '❌ Denied' : '⏳ Requesting...'}
                  </span>
                </div>
              </div>
              
              <div className="permission-item">
                <span className="permission-icon">📍</span>
                <div>
                  <strong>Location Access</strong>
                  <p>Required to pinpoint waste location</p>
                  <span className={`permission-status ${locationPermission}`}>
                    {locationPermission === 'granted' ? '✅ Granted' : 
                     locationPermission === 'denied' ? '❌ Denied' : '⏳ Requesting...'}
                  </span>
                </div>
              </div>
            </div>
            
            {permissionError && (
              <div className="permission-error">
                <p>{permissionError}</p>
              </div>
            )}
            
            <div className="permission-buttons">
              {(cameraPermission === 'denied' || locationPermission === 'denied') && (
                <button onClick={openBrowserSettings} className="settings-btn">
                  Open Browser Settings
                </button>
              )}
              <button onClick={requestPermissions} className="retry-btn">
                Try Again
              </button>
              <button onClick={closePermissionModal} className="close-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="home">
        {!showCamera ? (
          <div className="camera-button" onClick={handleCameraClick}>
            <img className="cam" src={camera} alt="Open Camera" />
            <p className="instruction-text">
              Click to open camera and report garbage issue
            </p>
            
            {/* Permission Status Indicators */}
            <div className="permission-indicators">
              <div className={`permission-indicator ${cameraPermission}`}>
                📷 Camera: {cameraPermission === 'granted' ? 'Ready' : 
                          cameraPermission === 'denied' ? 'Blocked' : 'Not Set'}
              </div>
              <div className={`permission-indicator ${locationPermission}`}>
                📍 Location: {locationPermission === 'granted' ? 'Ready' : 
                             locationPermission === 'denied' ? 'Blocked' : 'Not Set'}
              </div>
            </div>
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
              <button onClick={() => setShowCamera(false)}>❌ Close Camera</button>
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