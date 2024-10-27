import React from "react";
import { io, Socket } from "socket.io-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/Auth";
import MetroWeatherSummary from "./pages/MetroWeatherSummary";
import Navbar from "./components/Navbar";
import HelpPage from "./pages/Help";
const socket: Socket = io("http://127.0.0.1:5000");

const App: React.FC = () => {
  return (
    <Router>
      <div className="container mx-auto">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/summary" element={<MetroWeatherSummary />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
