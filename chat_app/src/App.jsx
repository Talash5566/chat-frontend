import React from 'react';
import Login from './Components/Login';
import Register from './Components/Register';
import { ToastContainer } from 'react-toastify';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './Components/Home';
import { Verifyuser } from './utils/Verifyuser.jsx';
import { useAuth } from './Context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { authUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-animated-gradient flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-animated-gradient">
      <Routes>
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={authUser ? <Navigate to="/" replace /> : <Register />}
        />

        
        <Route element={<Verifyuser />}>
          <Route path="/" element={<Home />} />
        </Route>

        
        <Route
          path="*"
          element={<Navigate to={authUser ? '/' : '/login'} replace />}
        />
      </Routes>

      <ToastContainer {...toastConfig} />
    </div>
  );
};

const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
};

export default App;
