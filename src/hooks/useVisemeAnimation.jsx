import { useEffect, useRef } from "react";
import * as THREE from "three";
import visemesEmitter from "../components/visemeEvents";
import { getVisemes } from "../Screens/ChatScreen";

const useVisemeAnimation = (
  group,
  setFacialExpression,
  visemeMap,
  setupMode
) => {
  const visemeDataRef = useRef([]);

  useEffect(() => {
    if (!group.current) return;

    const handleVisemesUpdated = ({ updatedVisemes, mood }) => {
      if (mood) setFacialExpression(mood);
      console.log("Received updated visemes in another file:", updatedVisemes);

      if (!group.current) {
        console.error("group.current is undefined. Cannot process visemes.");
        return;
      }

      try {
        const parsedData = JSON.parse(getVisemes());
        visemeDataRef.current = parsedData.map(({ t, v }) => ({ t, v }));
        console.log(visemeDataRef.current);
        playVisemeAnimation();
      } catch (error) {
        console.error("Error parsing visemes:", error);
      }
    };

    if (visemesEmitter.listeners("visemesUpdated").length === 0) {
      visemesEmitter.once("visemesUpdated", handleVisemesUpdated);
    }

    return () => {
      visemesEmitter.off("visemesUpdated", handleVisemesUpdated);
    };
  }, [group, visemesEmitter, getVisemes, setFacialExpression]);

  const lerpInfluence = (visemeName, targetValue, duration) => {
    const start = performance.now();

    const update = () => {
      const now = performance.now();
      const elapsed = (now - start) / duration;
      const t = Math.min(elapsed, 1);

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
              t
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


  const playVisemeAnimation = () => {
    let lastViseme = null;
    visemeDataRef.current.forEach(({ t, v }) => {
      const visemeName = visemeMap[v];
      const isSilent = v === "-";

      setTimeout(() => {
        if (lastViseme && visemeMap[lastViseme]) {
          lerpInfluence(visemeMap[lastViseme], 0, 300);
        }
        if (!isSilent && visemeName) {
          lerpInfluence(visemeName, 1, 300);
        }
        lastViseme = v;
      }, t * 1000);
    });

    if (!setupMode) {
      const lastTime =
        visemeDataRef.current[visemeDataRef.current.length - 1]?.t || 0;
      setTimeout(() => {
        if (!group.current) {
          console.error("group.current is undefined");
          return;
        }
        group.current.traverse((child) => {
          if (child.isSkinnedMesh && child.morphTargetInfluences) {
            child.morphTargetInfluences.fill(0);
          }
        });
        console.log("Reset all morph target influences.");
      }, (lastTime + 0.5) * 1000);
    }
  };
};


export default useVisemeAnimation;
