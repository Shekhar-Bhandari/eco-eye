import { createContext, useState } from 'react';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [capturedImage, setCapturedImage] = useState(null);

  return (
    <ImageContext.Provider value={{ capturedImage, setCapturedImage }}>
      {children}
    </ImageContext.Provider>
  );
};
