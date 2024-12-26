import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import React, { FC } from "react";
import ChatScreen from './Screens/ChatScreen'; 

const App: FC = () => {
  return (
    <>
      <ChatScreen /> 
    </>
  );
};

export default App;
