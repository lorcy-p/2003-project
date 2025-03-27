import { useEffect, useRef } from "react";
import * as THREE from "three";
import visemesEmitter from "../components/visemeEvents";
import { getVisemes } from "../Screens/ChatScreen";

/*
This hook is responsible for the animation of the models visemes, so as to provide lip sync with a received message 
It works by:

 - Setting up an event listener for updated visemes
 - When updated visemes are received, it calls handleVisemesUpdated, which updates the facial expression and processes the viseme data.
 - The received visemes are played using `playVisemeAnimation`, where each viseme is smoothly interpolated over time.
 - The viseme influences are gradually transitioned using a `lerp` function to create smooth facial animations.
*/

const useVisemeAnimation = (
  group,
  setFacialExpression,
  visemeMap,
  setupMode,
  nodes
) => {

  const visemeDataRef = useRef([]);

  
  // On Visemes Updated, change mood and play viseme animations
  useEffect(() => {
    if (!group.current) return;

    // Code to execute when visemes are updated
    const handleVisemesUpdated = ({ visemes, mood }) => {
      // Set facial expression based on mood
      if (mood) setFacialExpression(mood);


      // Log new visemes
      console.log("Received updated visemes:", visemes);

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

    // listens for updated visemes and runs previous code
    if (visemesEmitter.listeners("visemeEvent").length === 0) {
      visemesEmitter.off("visemeEvent", handleVisemesUpdated);
      visemesEmitter.on("visemeEvent", handleVisemesUpdated);
    }

    // Clean up listener on unmount
    return () => {
      visemesEmitter.off("visemeEvent", handleVisemesUpdated);
    };

  }, [group, visemesEmitter, getVisemes, setFacialExpression]);


  // Lerp function to alter viseme values
  const lerpInfluence = (node, visemeName, targetValue, duration, weight = 0.7) => {
    const start = performance.now(); // Get the starting time

    const update = () => {
      const now = performance.now(); // Get the current time
      const elapsed = (now - start) / duration; // Calculate the elapsed fraction
      const t = Math.min(elapsed, 1); // Clamp 't' between 0 and 1

      if (!node || !node.morphTargetDictionary || !node.morphTargetInfluences) {
        console.warn(`Node does not have morph targets:`, node);
        return;
      }

      const index = node.morphTargetDictionary[visemeName];
      if (index !== undefined) {
        node.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          node.morphTargetInfluences[index],
          targetValue,
          t * weight // Apply weighted average
        );
      } else {
        console.warn(`Viseme "${visemeName}" not found in morph targets of`, node);
      }

      if (t < 1) {
        requestAnimationFrame(update);
      }
    };

    update();
  };

  const lastVisemeRef = useRef(null); // Track the previous viseme

  // Use lerpInfluence to slowly change between each viseme in the given visemeData array
  const playVisemeAnimation = () => {
    console.log("playing visemes");
    let lastVisemeTargets = [];

    console.log("processing visemes");
    visemeDataRef.current.forEach(({ t, v }, index) => {
        const visemeTargets = visemeMap[v] || []; // Map viseme to multiple morph targets
        const isSilent = v === "-"; // Check if the viseme represents silence

        setTimeout(() => {
            console.log("timeout");

            Object.keys(nodes).forEach((meshName) => {
                const mesh = nodes[meshName];

                if (mesh.morphTargetDictionary) {
                    // Reset previous viseme influences gradually
                    lastVisemeTargets.forEach((prevViseme) => {
                        if (mesh.morphTargetDictionary[prevViseme] !== undefined) {
                            lerpInfluence(mesh, prevViseme, 0, 300, 0.2); // Reset over 300ms
                        }
                    });

                    // Apply new viseme influences gradually
                    if (!isSilent && visemeTargets.length > 0) {
                        visemeTargets.forEach((visemeTarget, i) => {
                            if (mesh.morphTargetDictionary[visemeTarget] !== undefined) {
                                
                              lerpInfluence(mesh, visemeTarget, 1, 300, 0.2); // Apply over 300ms
                                
                            }
                        });
                    }
                } else {
                    //console.log(`Skipping mesh ${meshName}, no morph target dictionary.`);
                }
            });

            lastVisemeTargets = visemeTargets; // Update last viseme list
        }, t * 1000 + index * 10); // Small delay per viseme to avoid collisions
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

  return { lerpInfluence };
};

export default useVisemeAnimation;
