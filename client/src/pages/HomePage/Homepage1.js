import React, { useState } from 'react';
import camera from '../../images/camera.png';
import Webcam from 'react-webcam';

const HomePage = () => {
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = React.useRef(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user'
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowWebcam(false); // optionally hide webcam after capture
  };

  return (
    <div className='home'>
      <div>
        <button
          className='camera-btn'
          onClick={() => setShowWebcam((prev) => !prev)}
        >
          <img src={camera} alt='camera' />
        </button>

        {showWebcam && (
          <div>
            <Webcam
              audio={false}
              ref={webcamRef}
              height={720}
              screenshotFormat="image/jpeg"
              width={1280}
              videoConstraints={videoConstraints}
            />
            <button onClick={capture}>Capture photo</button>
          </div>
        )}

        {capturedImage && (
          <div>
            <h2>Captured Image:</h2>
            <img src={capturedImage} alt='Captured' />
          </div>
        )}

        <div className='send-btn'>
          <button>send</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
