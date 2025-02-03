import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
  useTexture,
} from "@react-three/drei";
import React from "react";
import { FC, Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { TestAvatar } from "./TestAvatar";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Simple loading response ui
const Dots: FC<React.ComponentProps<"group">> = (props) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] = useState<string>("");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((prevLoadingText) => {
          if (prevLoadingText.length > 2) {
            return ".";
          }
          return prevLoadingText + ".";
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);

  if (!loading) return null;

  return (
    <group {...props}>
      <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
        {loadingText}
        <meshBasicMaterial attach="material" color="black" />
      </Text>
    </group>
  );
};

export const Experience: FC = () => {
  const cameraControls = useRef<CameraControls>(null);
  const { cameraZoomed } = useChat();

  useEffect(() => {
    cameraControls.current?.setLookAt(0, 2, 5, 0, 1.5, 0);
  }, []);

  useEffect(() => {
    if (cameraZoomed) {
      cameraControls.current?.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, true);
    } else {
      cameraControls.current?.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
    }
  }, [cameraZoomed]);

  const Background = () => {
    const texture = useTexture("Textures/FarmRoad.jpg");
    texture.colorSpace = THREE.SRGBColorSpace;
    const { scene } = useThree();
    scene.background = texture;
    return null;
  };

  return (
    <>
      <CameraControls ref={cameraControls} />
      <Background />
      <TestAvatar />
      <Environment preset="sunset" />

      <ContactShadows opacity={0.7} />
    </>
  );
};
