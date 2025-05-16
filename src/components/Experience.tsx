import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
  useTexture,
} from "@react-three/drei";
import React, { useMemo } from "react";
import { FC, Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { Smith } from "../models/CC4Blacksmith";
import { Avatar } from "../models/Avatar";
import { CC4Test } from "../models/CC4Test";
import { Medic } from "../models/CC4Medic";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

type ExperienceProps = {
  scenarioID: number;
};

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

export const Experience: FC<ExperienceProps> = ({ scenarioID }) => {
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

  const Background = React.memo(({ scenarioID }: { scenarioID: number }) => {
    const textureMap: Record<number, string> = {
      166: "Textures/FarmRoad.jpg",
      173: "Textures/Forge.png",
      179: "Textures/MedicTent.jpg",
    };

    const texturePath = textureMap[scenarioID] || "Textures/FarmRoad.jpg";
    const texture = useTexture(texturePath);
    texture.colorSpace = THREE.SRGBColorSpace;

    const { scene } = useThree();
    useEffect(() => {
      scene.background = texture;
    }, [scene, texture]);

    return null;
  });

  const scenarioModel = useMemo(() => {
    switch (scenarioID) {
      case 166:
        return <CC4Test key={166} />;
      case 173:
        return <Smith key={173} />;
      case 179:
        return <Medic key={179} />;
      default:
        return <Avatar key={0} />;
    }
  }, [scenarioID]);

  return (
    <>
      <CameraControls ref={cameraControls} />
      <Background scenarioID={scenarioID} />

      <Suspense fallback={<Dots position={[-0.5, 1, 0]} />}>
        {scenarioModel}
      </Suspense>

      <Environment preset="sunset" />
    </>
  );
};
