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
    animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name
  );

  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);


  // Full Body Animations
  useEffect(() => {
    if (!animation || !actions) return;
  
    // Fade out all other actions
    Object.keys(actions).forEach((key) => {
      if (key !== animation && actions[key]) {
        actions[key].fadeOut(0.5);
      }
    });
  
    // Play the new animation
    if (actions[animation]) {
      actions[animation]
        .reset()
        .fadeIn(0.5)
        .play();
    }


    console.log('Playing:', animation);
    Object.entries(actions).forEach(([name, act]) => {
     console.log(`${name}: ${act.isRunning()}`);
    });
  
    return () => {
      if (actions[animation]) {
        actions[animation].fadeOut(0.5);
      }
    };
      
    
  }, [animation, actions]);



  return { animation, animations, setAnimation};
};

export default useCharacterAnimation;