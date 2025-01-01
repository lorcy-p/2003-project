import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import React, { FC } from "react";
import ChatScreen from './Screens/ChatScreen'; 
import SelectAI from "./Screens/SelectAiScreen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./Screens/LoginScreen";

const App: FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SelectAI />} />
          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </Router>

      
    </>
  );
};

export default App;
