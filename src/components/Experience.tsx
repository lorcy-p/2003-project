import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
} from "@react-three/drei";
import React from "react";
import { FC, Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { TestAvatar } from "./TestAvatar";

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

  return (
    <>
      <CameraControls ref={cameraControls} />
      <Environment preset="sunset" />
      <Suspense>
        <Dots position-y={1.83} position-x={-0.09} />
      </Suspense>
      <TestAvatar />
      <ContactShadows opacity={0.7} />
    </>
  );
};
