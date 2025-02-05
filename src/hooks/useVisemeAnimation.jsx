import { useEffect, useRef } from "react";
import * as THREE from "three";
import visemesEmitter from "../components/visemeEvents";
import { getVisemes } from "../Screens/ChatScreen";

/*
This hook is responsible for the animation of the models visemes , so as to provide lip sync with a received message 
It does this using the following workflow :


 - First, an effect is used which contains an event listener to detect when new visemes and mood are received on the ChatScreen


 - When this event is detected handleVisemesUpdated is run, this first assigns the mood to the SetFacialExpression State passed into this hook,
  this is utilised in useCharacterAnimation to change the facial expression


 - Next, the received JSON data for the visemes are converted into a readable array and saved into visemeData. This is read next when playVisemeAnimation
  is run. 


 - playVisemeAnimation translates each viseme name using the input visemeMap, this allows it to work interchangeably wih many different models even if 
  the names of visemes differ from model to model. 


 - Next over a period of 300ms (or 0.3 seconds) playVisemeAnimation applies the next viseme whilst removing the previous viseme to smoothly animate 
  the models mouth and provide lip sync.


 - It applies these visemes with lerpInfluence which is similar to useCharacterAnimation's lerpMorphTarget as they both use the Math.Lerp method to
  move between values, lerpInfluence differs in the fact that it has a duration rather than a speed so it can work with the set timings received.


 - In short lerpInfluence calculates the exact timing of the viseme and request an animation frame at that time to prepare for the animation, it
  then finds the Morph Target Influence of the model based on the current visemeName before finally changing its value with Math.lerp


*/

const useVisemeAnimation = (
  group,
  setFacialExpression,
  visemeMap,
  setupMode
) => {

  const visemeDataRef = useRef([]);


  // On Visemes Updated, change mood and play viseme animations
  useEffect(() => {

    if (!group.current) return;

    // Code to execute when visemes are updated
    const handleVisemesUpdated = ({ updatedVisemes, mood }) => {
      // Set facial expression based on mood
      if (mood) setFacialExpression(mood);

      // Log new visemes
      console.log("Received updated visemes in another file:", updatedVisemes);


      if (!group.current) {
        console.error("group.current is undefined. Cannot process visemes.");
        return;
      }

      // Reconfigure visemes JSON into a readable array and play viseme animation
      try {
        const parsedData = JSON.parse(getVisemes());
        visemeDataRef.current = parsedData.map(({ t, v }) => ({ t, v }));
        console.log(visemeDataRef.current);
        playVisemeAnimation();
      } catch (error) {
        console.error("Error parsing visemes:", error);
      }
    };

    // listens for updated visemes then runs previous code
    if (visemesEmitter.listeners("visemesUpdated").length === 0) {
      visemesEmitter.on("visemesUpdated", handleVisemesUpdated);
    }

  }, [group, visemesEmitter, getVisemes, setFacialExpression]);


  // Lerp function to alter viseme values
  const lerpInfluence = (visemeName, targetValue, duration, weight = 0.7) => {
    const start = performance.now(); // Get the starting time

    const update = () => {
      const now = performance.now(); // Get the current time
      const elapsed = (now - start) / duration; // Calculate the elapsed fraction
      const t = Math.min(elapsed, 1); // Clamp 't' between 0 and 1

      if (!group.current) {
        console.error("group.current is undefined");
        return;
      }

      group.current.traverse((child) => {
        if (child.isSkinnedMesh && child.morphTargetDictionary) {
          const index = child.morphTargetDictionary[visemeName];
          if (index !== undefined) {
            child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
              child.morphTargetInfluences[index],
              targetValue,
              t * weight //apply weighted average here
            );
          } else {
            console.warn(`Viseme "${visemeName}" not found in morph targets.`);
          }
        }
      });

      if (t < 1) {
        requestAnimationFrame(update);
      }
    };
    update();
  };


  // Use lerpInfluence to slowly change between each viseme in the given visemeData array
  const playVisemeAnimation = () => {
    let lastViseme = null; // Track the previous viseme

    visemeDataRef.current.forEach(({ t, v }) => {
      const visemeName = visemeMap[v]; // Map the viseme symbol to the morph target name
      const isSilent = v === "-"; // Check if the viseme represents silence

      setTimeout(() => {
         // Gradually reset the previous viseme
        if (lastViseme && visemeMap[lastViseme]) {
          lerpInfluence(visemeMap[lastViseme], 0, 300, 0.7); // Reset over 300ms
        }

        // Gradually apply the current viseme
        if (!isSilent && visemeName) {
          lerpInfluence(visemeName, 1, 300, 0.7); // Apply over 300ms
        }

        lastViseme = v; // Update the last viseme
      }, t * 1000); // Convert time to milliseconds
    });

    // Reset all morph target influences at the end of the animation
    if (!setupMode) {
      const lastTime =
        visemeDataRef.current[visemeDataRef.current.length - 1]?.t || 0; // Get the last viseme's timestamp
      setTimeout(() => {
        if (!group.current) {
          console.error("group.current is undefined"); 
          return;
        }
        group.current.traverse((child) => {
          if (child.isSkinnedMesh && child.morphTargetInfluences) {
            child.morphTargetInfluences.fill(0); // Reset all influences to 0
          }
        });
        console.log("Reset all morph target influences.");
      }, (lastTime + 0.5) * 1000); // Add 500ms delay to ensure smooth reset
    }
  };

  return {lerpInfluence };
};


export default useVisemeAnimation;
