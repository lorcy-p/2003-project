import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import visemesEmitter from "../components/visemeEvents";
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
      console.log("Received updated visemes:", visemes);

      if (!group.current) {
        console.error("group.current is undefined. Cannot process visemes.");
        return;
      }

      try {
        const parsedData = JSON.parse(getVisemes());
        visemeDataRef.current = parsedData.map(({ t, v }) => ({ t, v }));
        playVisemeAnimation();
      } catch (error) {
        console.error("Error parsing visemes:", error);
      }
    };

    if (visemesEmitter.listeners("visemeEvent").length === 0) {
      visemesEmitter.off("visemeEvent", handleVisemesUpdated);
      visemesEmitter.on("visemeEvent", handleVisemesUpdated);
    }

    return () => {
      visemesEmitter.off("visemeEvent", handleVisemesUpdated);
    };
  }, [group, visemesEmitter, getVisemes, setFacialExpression]);

  const lerpInfluence = (node, visemeName, targetValue, duration, weight = 0.7) => {
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
    if (manualJawControl) return;
    console.log("playing visemes");
    let lastVisemeTargets = [];

    visemeDataRef.current.forEach(({ t, v }, index) => {
      const visemeTargets = visemeMap[v] || [];
      const isSilent = v === "-";
      const isJawOpen = v === "Open_Jaw" || v === "V_Open";

      setTimeout(() => {
        Object.keys(nodes).forEach((meshName) => {
          const mesh = nodes[meshName];

          if (mesh.morphTargetDictionary) {
            lastVisemeTargets.forEach((prevViseme) => {
              if (mesh.morphTargetDictionary[prevViseme] !== undefined) {
                lerpInfluence(mesh, prevViseme, 0, 300, 0.2);
              }
            });

            if (!isSilent && visemeTargets.length > 0) {
              visemeTargets.forEach((visemeTarget) => {
                if (mesh.morphTargetDictionary[visemeTarget] !== undefined) {
                  lerpInfluence(mesh, visemeTarget, 1, 300, 0.2);
                }
              });
            }
          }
        });

        if (isJawOpen) {
          const jawRotation = new THREE.Euler(-0.3, 0, 0);
          lerpJawRotation(jawRotation, 300);
        } else {
          const neutralRotation = new THREE.Euler(0, 0, 0);
          lerpJawRotation(neutralRotation, 300);
        }

        lastVisemeTargets = visemeTargets;
      }, t * 1000 + index * 10);
    });
  };

  return { lerpInfluence };
};

export default useVisemeAnimation;
