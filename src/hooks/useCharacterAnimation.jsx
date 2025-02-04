import { useState, useEffect } from "react";
import * as THREE from "three";
import { useAnimations, useGLTF, Html} from "@react-three/drei";

const useCharacterAnimation = (modelPath, group, scene, setupMode) => {
  const { animations } = useGLTF(modelPath);
  const { actions, mixer } = useAnimations(animations, group);
  
  const [animation, setAnimation] = useState(
    animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name
  );

  useEffect(() => {
    if (actions[animation]) {
      actions[animation]
        .reset()
        .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
        .play();
    }
    return () => {
      if (actions[animation]) actions[animation].fadeOut(0.5);
    };
  }, [animation, actions, mixer]);

  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (
          index !== undefined &&
          child.morphTargetInfluences[index] !== undefined
        ) {
          child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
            child.morphTargetInfluences[index],
            value,
            speed
          );
          
          if (!setupMode) {
            try {
              set({ [target]: value });
            } catch (e) {}
          }
        }
      }
    });
  };

  return { animation, animations, setAnimation, lerpMorphTarget };
};

export default useCharacterAnimation;