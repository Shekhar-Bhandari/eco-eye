import { Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage/HomePage";
import { ImageProvider } from "./Context/ImageContext";
import AdminPage from "./pages/Admin/AdminPage";


function App() {
  return (
    <div>
      <ImageProvider>
      <Routes>
      
       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/" element={<HomePage />} />
                   <Route path="/admin" element={<AdminPage />} />


      </Routes>
      </ImageProvider>
      <Toaster />
    </div>
  );
}

export default App;
