import { useGLTF } from "@react-three/drei";
import { Html } from "@react-three/drei";
import React, { useRef } from "react";
import * as THREE from "three";

export function TestAvatar(props) {
  const { nodes, materials } = useGLTF("models/testmodel.glb");
  const group = useRef();

  // Helper: Smoothly interpolate morph target influences
  const lerpMorphTarget = (visemeName, targetValue, speed = 0.1) => {
    group.current.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[visemeName];
        if (index !== undefined) {
          child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
            child.morphTargetInfluences[index],
            targetValue,
            speed
          );
          console.log(`Animating ${visemeName} to ${targetValue}`);
        } else {
          console.warn(`Viseme "${visemeName}" not found in morph targets.`);
        }
      }
    });
  };

  // Viseme animation sequence
  const visemeSequence = [
    { viseme: "viseme_kk", value: 1, time: 0.5 },
    { viseme: "viseme_DD", value: 0.7, time: 1.0 },
    { viseme: "viseme_PP", value: 0.3, time: 1.5 },
    { viseme: "viseme_TH", value: 0.8, time: 2.0 },
    { viseme: "viseme_AA", value: 0.1, time: 2.5 },
  ];

  // Function to play viseme animation sequence
  const playVisemeAnimation = () => {
    visemeSequence.forEach(({ viseme, value, time }) => {
      setTimeout(() => {
        lerpMorphTarget(viseme, value, 0.3); // Set animation speed here
      }, time * 1000); // Convert seconds to milliseconds
    });

    // Reset all influences to 0 after the sequence finishes
    setTimeout(() => {
      group.current.traverse((child) => {
        if (child.isSkinnedMesh && child.morphTargetInfluences) {
          child.morphTargetInfluences.fill(0); // Reset all influences to 0
        }
      });
      console.log("Reset all morph target influences.");
    }, (visemeSequence[visemeSequence.length - 1].time + 0.5) * 1000); // Allow buffer time
  };

  return (
    <>
      <group {...props} dispose={null} ref={group}>
        <primitive object={nodes.Hips} />
        <skinnedMesh
          name="EyeLeft"
          geometry={nodes.EyeLeft.geometry}
          material={materials.Wolf3D_Eye}
          skeleton={nodes.EyeLeft.skeleton}
          morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
          morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
        />
        <skinnedMesh
          name="EyeRight"
          geometry={nodes.EyeRight.geometry}
          material={materials.Wolf3D_Eye}
          skeleton={nodes.EyeRight.skeleton}
          morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
          morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
        />
        <skinnedMesh
          name="Wolf3D_Head"
          geometry={nodes.Wolf3D_Head.geometry}
          material={materials.Wolf3D_Skin}
          skeleton={nodes.Wolf3D_Head.skeleton}
          morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
          morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
        />
        <skinnedMesh
          name="Wolf3D_Teeth"
          geometry={nodes.Wolf3D_Teeth.geometry}
          material={materials.Wolf3D_Teeth}
          skeleton={nodes.Wolf3D_Teeth.skeleton}
          morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
          morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Hair.geometry}
          material={materials.Wolf3D_Hair}
          skeleton={nodes.Wolf3D_Hair.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Glasses.geometry}
          material={materials.Wolf3D_Glasses}
          skeleton={nodes.Wolf3D_Glasses.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Body.geometry}
          material={materials.Wolf3D_Body}
          skeleton={nodes.Wolf3D_Body.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
          material={materials.Wolf3D_Outfit_Bottom}
          skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
          material={materials.Wolf3D_Outfit_Footwear}
          skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Top.geometry}
          material={materials.Wolf3D_Outfit_Top}
          skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
        />
      </group>
      <Html position={[-1, 1, 0]}>
        <button onClick={playVisemeAnimation}>Play Viseme Animation</button>
      </Html>
    </>
  );
}

export default TestAvatar;
