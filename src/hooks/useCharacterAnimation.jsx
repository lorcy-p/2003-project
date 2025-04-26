import { useState, useEffect } from "react";
import * as THREE from "three";
import { useAnimations, useGLTF} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

/*

This hook is responsible for the animation of the rest of the model (i.e its full body and facial features apart from the visemes)
It does this using two main features:


 - First, useAnimations from react-three/drei is used to make the full body move utilising animations saved in a glb file


 - Second, lerpMorphTarget is used to make changes to the models face by gradually moving Morph Target Influences (points on the face)
  into set positions utilising linear interpolation to gradually shift between maximum and minimum values of 1 and 0. This allows each
  pre-assigned MTI to be changed at any time, this is mainly utilised to change the facial expression of the model based on a received mood.


 - Finally, lerpMorphTarget is specifically used on the models eyes/eyelids to simulate blinking, this is then passed into an effect to be
  triggered based on a random timeout between 1000ms and 5000ms (between 1-5 seconds)

*/

const useCharacterAnimation = (modelPath, group, scene, nodes, facialExpressions, facialExpression, setupMode) => {
  const { animations } = useGLTF(modelPath);
  const { actions, mixer } = useAnimations(animations, group);

  const [animation, setAnimation] = useState(
        animations.find((a) => a.name === "Idle") ? "Idle" : animations[3].name // Check if Idle animation exists otherwise use first animation
      );

  // to check names of animations in glb file
  /*
  useEffect(() => {
    if (animations.length) {
      animations.forEach((clip, index) => {
        console.log(`Animation ${index}: ${clip.name || `Unnamed_${index}`}`)
      })
    } else {
      console.log('No animations found in the GLB file.')
    }
  }, [animations])
  */

  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);


  // Full Body Animations
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


  // Lerp Function
  const lerpMorphTarget = (target, value, speed = 0.1, weight = 0.3) => {
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
            speed * weight
          );
        }
      }
    });
  };


  // Blinking
  useFrame(() => {
    if (!setupMode && nodes.EyeLeft) {
      Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
        const mapping = facialExpressions[facialExpression];
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") return;
        lerpMorphTarget(key, mapping && mapping[key] ? mapping[key] : 0, 0.1, 1);
      });
    }
    
    lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5, 1);
    lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5, 1);
  });


  // Automatic Blinking Trigger
  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  return { animation, animations, setAnimation, lerpMorphTarget, setWinkLeft, setWinkRight };
};

export default useCharacterAnimation;