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
import HomeScreen from "./Screens/HomeScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuth from './hooks/useAuth';

const App: FC = () => {
  const { isAuthenticated, userToken, userId, login, logout } = useAuth();
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<HomeScreen />} />
            <Route path="/characters" element={
                <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    authenticationPath="/login"
                >
                    <SelectAI />
                </ProtectedRoute>
            } />
          <Route path="/chat" element={<ChatScreen />} />
        </Routes>
      </Router>

      
    </>
  );
};

export default App;
