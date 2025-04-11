import React from 'react';
import Home from './pages/Home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Modal from 'react-modal';

// Set the app element for react-modal
// Modal.setAppElement('#root');

//replace the localhost link to this link "https://cheery-rolypoly-0c0f13.netlify.app/" in stablise the connectivity to the deployed backend

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
