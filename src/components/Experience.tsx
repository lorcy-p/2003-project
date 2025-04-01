import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
  useTexture,
} from "@react-three/drei";
import React from "react";
import { FC, Suspense, useEffect, useRef, useState } from "react";
import { TestAvatar } from "./TestAvatar";
import { Avatar } from "./Avatar";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Simple loading response ui
const Dots: FC<React.ComponentProps<"group">> = (props) => {
  const [loadingText, setLoadingText] = useState<string>("");

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
  const [cameraZoomed, setCameraZoomed] = useState(true);

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

  const facialExpressions = {
    default: {},
    test: {
      viseme_CH: 0.75,
      viseme_SS: 0.79,
      eyeSquintLeft: 1,
      eyeSquintRight: 1,
      eyeWideRight: 1,
    },
    happy: {
      browInnerUp: 0.17,
      eyeSquintLeft: 0.4,
      eyeSquintRight: 0.44,
      noseSneerLeft: 0.1700000727403593,
      noseSneerRight: 0.14000002836874015,
      mouthPressLeft: 0.61,
      mouthPressRight: 0.41000000000000003,
    },
    surprised: {
      eyeWideLeft: 0.5,
      eyeWideRight: 0.5,
      jawOpen: 0.351,
      mouthFunnel: 1,
      browInnerUp: 1,
    },
    funnyFace: {
      jawLeft: 0.63,
      mouthPucker: 0.53,
      noseSneerLeft: 1,
      noseSneerRight: 0.39,
      mouthLeft: 1,
      eyeLookUpLeft: 1,
      eyeLookUpRight: 1,
      cheekPuff: 0.9999924982764238,
      mouthDimpleLeft: 0.414743888682652,
      mouthRollLower: 0.32,
      mouthSmileLeft: 0.35499733688813034,
      mouthSmileRight: 0.35499733688813034,
    },
    sad: {
      mouthFrownLeft: 1,
      mouthFrownRight: 1,
      mouthShrugLower: 0.78341,
      browInnerUp: 0.452,
      eyeSquintLeft: 0.72,
      eyeSquintRight: 0.75,
      eyeLookDownLeft: 0.5,
      eyeLookDownRight: 0.5,
      jawForward: 1,
    },
    angry: {
      browDownLeft: 1,
      browDownRight: 1,
      eyeSquintLeft: 1,
      eyeSquintRight: 1,
      jawForward: 1,
      jawLeft: 1,
      mouthShrugLower: 1,
      noseSneerLeft: 1,
      noseSneerRight: 0.42,
      eyeLookDownLeft: 0.16,
      eyeLookDownRight: 0.16,
      cheekSquintLeft: 1,
      cheekSquintRight: 1,
      mouthClose: 0.23,
      mouthFunnel: 0.63,
      mouthDimpleRight: 1,
    },
    crazy: {
      browInnerUp: 0.9,
      jawForward: 1,
      noseSneerLeft: 0.5700000000000001,
      noseSneerRight: 0.51,
      eyeLookDownLeft: 0.39435766259644545,
      eyeLookUpRight: 0.4039761421719682,
      eyeLookInLeft: 0.9618479575523053,
      eyeLookInRight: 0.9618479575523053,
      jawOpen: 0.9618479575523053,
      mouthDimpleLeft: 0.9618479575523053,
      mouthDimpleRight: 0.9618479575523053,
      mouthStretchLeft: 0.27893590769016857,
      mouthStretchRight: 0.2885543872656917,
      mouthSmileLeft: 0.5578718153803371,
      mouthSmileRight: 0.38473918302092225,
      tongueOut: 0.9618479575523053,
    },
  };

  // Map viseme symbols to corresponding morph target names
  const visemeMap = {
    "-": "viseme_sil",
    a: "viseme_aa",
    e: "viseme_E",
    i: "viseme_I",
    o: "viseme_O",
    u: "viseme_U",
    f: "viseme_FF",
    s: "viseme_SS",
    th: "viseme_TH",
    k: "viseme_kk",
    r: "viseme_RR",
    d: "viseme_DD",
    p: "viseme_PP",
    ch: "viseme_CH",
    n: "viseme_nn",
  };

  //<Avatar />

  return (
    <>
      <CameraControls ref={cameraControls} />
      <Background />
      <Environment preset="sunset" />
      <ContactShadows opacity={0.7} />
    </>
  );
};
