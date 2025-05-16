import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import visemesEmitter from "../components/visemeEvents";
import emitter from '../components/eventEmitter';
import { getVisemes } from "../Screens/ChatScreen";

const useVisemeAnimation = (
  group,
  setFacialExpression,
  visemeMap,
  setupMode,
  nodes,
  characterRef
) => {
  const visemeDataRef = useRef([]);
  const [manualJawControl, setManualJawControl] = useState(false);

  const { jawRotationX } = useControls("Jaw Control", {
    jawRotationX: { value: 0, min: -0.5, max: 0.5, step: 0.01 },
    manualJawControl: false,
  });

  useEffect(() => {
    if (!group.current) return;

    const handleVisemesUpdated = ({ visemes, mood }) => {
      if (mood) setFacialExpression(mood);
      //console.log("Received updated visemes:", visemes);

      /*
      if (!group.current) {
        console.error("group.current is undefined. Cannot process visemes.");
        return;
      }
      */

      try {
        const rawVisemes = getVisemes();
        console.log("Raw visemes string:", rawVisemes);
      
        const parsedData = JSON.parse(rawVisemes);
        console.log("Parsed data:", parsedData);
      
        visemeDataRef.current = parsedData.map(({ t, v }) => ({ t, v }));
        console.log("viseme data parsed");
        playVisemeAnimation();
      } catch (error) {
        console.error("Error parsing visemes:", error);
      }

    };

    console.log("Checking and registering listener if needed...");
    console.log("Registering visemesUpdated listener for this model");
    visemesEmitter.on("visemesUpdated", handleVisemesUpdated);

    return () => {
      console.log("Removing visemesUpdated listener for this model");
      visemesEmitter.off("visemesUpdated", handleVisemesUpdated);
    };


    return () => {
      visemesEmitter.off("visemeEvent", handleVisemesUpdated);
    };
  }, [group, visemesEmitter, getVisemes, setFacialExpression]);

  const lerpInfluence = (node, visemeName, targetValue, duration, weight = 1 ) => {
    const start = performance.now();

    const update = () => {
      const now = performance.now();
      const elapsed = (now - start) / duration;
      const t = Math.min(elapsed, 1);

      if (!node || !node.morphTargetDictionary || !node.morphTargetInfluences) {
        console.warn(`Node does not have morph targets:`, node);
        return;
      }

      const index = node.morphTargetDictionary[visemeName];
      if (index !== undefined) {
        node.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          node.morphTargetInfluences[index],
          targetValue,
          t * weight
        );
      }

      if (t < 1) {
        requestAnimationFrame(update);
      }
    };

    update();
  };

  const lerpJawRotation = (targetRotation, duration) => {
    const startTime = performance.now();

    const update = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / duration;
      const t = Math.min(elapsed, 1);

      Object.keys(nodes).forEach((meshName) => {
        const mesh = nodes[meshName];
        if (mesh.name === "CC_Base_JawRoot") {
          mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRotation.x, t);
          mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetRotation.y, t);
          mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, targetRotation.z, t);
        }
      });

      if (t < 1) {
        requestAnimationFrame(update);
      }
    };

    update();
  };


 //Jaw Leva
 const controls = useControls("Jaw Control", {
  jawRotationX: { value: 0, min: -0.2, max: 0.2, step: 0.01 },
  jawRotationY: { value: 0, min: -0.5, max: 0.5, step: 0.01 },
  jawRotationZ: { value: 0, min: 1.55, max: 2, step: 0.01 },
  manualJawControl: { value: false },
});

useEffect(() => {
  if (!characterRef.current) return;

  const jaw = characterRef.current.getObjectByName("CC_Base_JawRoot");
  if (jaw && controls.manualJawControl) {
    jaw.rotation.x = controls.jawRotationX;
    jaw.rotation.y = controls.jawRotationY;
    jaw.rotation.z = controls.jawRotationZ;
  }
}, [controls.jawRotationX, controls.jawRotationY, controls.jawRotationZ, controls.manualJawControl, characterRef]);




  const playVisemeAnimation = () => {
    emitter.emit('visemeStart');

    if (manualJawControl) {
      console.log("manual jaw cancel");
      return;
    }
    console.log("playing visemes");
    let lastVisemeTargets = [];

    visemeDataRef.current.forEach(({ t, v }, index) => {
      const visemeTargets = visemeMap[v] || [];
      const isSilent = v === "-";

      setTimeout(() => {
        Object.keys(nodes).forEach((meshName) => {
          const mesh = nodes[meshName];

          if (mesh.morphTargetDictionary) {
            lastVisemeTargets.forEach(({ target: prevViseme }) => {
              if (mesh.morphTargetDictionary[prevViseme] !== undefined) {
                lerpInfluence(mesh, prevViseme, 0, 500, 1);
              }

              if (mesh.morphTargetDictionary[prevViseme] == "Jaw_Open" || mesh.morphTargetDictionary[prevViseme] == "V_Tight_O" || 
                mesh.morphTargetDictionary[prevViseme] == "V_Lip_Open" || mesh.morphTargetDictionary[prevViseme] == "V_Affricate") {
                const neutralRotation = new THREE.Euler(0, 0, 1.55);
                lerpJawRotation(neutralRotation, 500);
              }

            });

            if (!isSilent && visemeTargets.length > 0) {
              let finalRotation = null;
              let maxWeight = 0;
            
              visemeTargets.forEach(({ target, weight }) => {
                const morphIndex = mesh.morphTargetDictionary[target];
            
                if (target  === "Jaw_Open" && weight > maxWeight) {
                  maxWeight = weight;
                  const minRotation = 1.55;
                  const maxRotation = 2.0;
                  const mappedRotation = minRotation + (maxRotation - minRotation) * weight;
                  finalRotation = new THREE.Euler(0, 0, mappedRotation);
                }
            
                if (target  === "V_Tight_O" && weight > maxWeight) {
                  maxWeight = weight;
                  const minRotation = 1.55;
                  const maxRotation = 1.75;
                  const mappedRotation = minRotation + (maxRotation - minRotation) * weight;
                  finalRotation = new THREE.Euler(0, 0, mappedRotation);
                }
            
                if ((target  === "V_Lip_Open" || target  === "V_Affricate" )&& weight > maxWeight) {
                  maxWeight = weight;
                  const minRotation = 1.55;
                  const maxRotation = 1.60;
                  const mappedRotation = minRotation + (maxRotation - minRotation) * weight;
                  finalRotation = new THREE.Euler(0, 0, mappedRotation);
                }
            
                // Still apply influence per target
                if (morphIndex  !== undefined) {
                  lerpInfluence(mesh, target, weight, 500, 1);
                }

                 // Apply final jaw rotation only once
                if (finalRotation) {
                  //console.log("Applying jaw rotation:", finalRotation.z.toFixed(3));
                  lerpJawRotation(finalRotation, 500);
                }
              });
            }
          }
        });

        

        lastVisemeTargets = visemeTargets;


      }, t * 1000 + index * 10);

      
      //emitter.emit('visemeEnd');
      
    });
  };

  return { lerpInfluence, lerpJawRotation };
};

export default useVisemeAnimation;
