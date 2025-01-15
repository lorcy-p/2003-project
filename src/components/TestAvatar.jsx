import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useAnimations, useGLTF, Html} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import { getVisemes } from "../Screens/ChatScreen";
import visemesEmitter from "../components/visemeEvents";

export function TestAvatar(props) {

  //Load the GLTF model
  const { nodes, materials, scene } = useGLTF('models/testmodel.glb')
  const group = useRef();

  let setupMode = false;

  const facialExpressions = {
    default: {},
    test: {
    viseme_CH: 0.75,
  viseme_SS: 0.79,
  eyeSquintLeft: 1,
  eyeSquintRight: 1,
  eyeWideRight: 1
    },
    smile: {
      browInnerUp: 0.17,
      eyeSquintLeft: 0.4,
      eyeSquintRight: 0.44,
      noseSneerLeft: 0.1700000727403593,
      noseSneerRight: 0.14000002836874015,
      mouthPressLeft: 0.61,
      mouthPressRight: 0.41000000000000003,
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
    surprised: {
      eyeWideLeft: 0.5,
      eyeWideRight: 0.5,
      jawOpen: 0.351,
      mouthFunnel: 1,
      browInnerUp: 1,
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
    "a": "viseme_aa",
    "e": "viseme_E",
    "i": "viseme_I",
    "o": "viseme_O",
    "u": "viseme_U",
    "f": "viseme_FF",
    "s": "viseme_SS",
    "th": "viseme_TH",
    "k": "viseme_kk",
    "r": "viseme_RR",
    "d": "viseme_DD",
    "p": "viseme_PP",
    "ch": "viseme_CH",
    "n": "viseme_nn",
  };

  let visemeData = [];

  visemesEmitter.on('visemesUpdated', (updatedVisemes) => {
    console.log("Received updated visemes in another file:", updatedVisemes);

    // Parse the string into a JavaScript array
    const parsedData = JSON.parse(getVisemes());

    // Map it into the desired format
    visemeData = parsedData.map(({ t, v }) => ({ t, v }));

    // Output the result
    console.log(visemeData);
    // Play lip animation with updated visemes
    playVisemeAnimation()
  });

  // Function to smoothly lerp a morph target's influence
  const lerpInfluence = (visemeName, targetValue, duration) => {
    const start = performance.now(); // Get the starting time

    const update = () => { 
      const now = performance.now(); // Get the current time
      const elapsed = (now - start) / duration; // Calculate the elapsed fraction
      const t = Math.min(elapsed, 1); // Clamp `t` between 0 and 1 

      if (!group.current) {
        console.error('Object is undefined');
      } else {
        group.current.traverse((child) => {
          if (child.isSkinnedMesh && child.morphTargetDictionary) {
            const index = child.morphTargetDictionary[visemeName];
            if (index !== undefined) {
               // Interpolate the morph target influence value aka animate it
              child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                child.morphTargetInfluences[index],
                targetValue,
                t
              );
              // Useful log to see which visemes are being animated
              //console.log(`Animating ${visemeName} to ${targetValue}`);
            } else {
              console.warn(`Viseme "${visemeName}" not found in morph targets.`);
            }
          }
        });
      }
      

      // Continue the animation loop until `t` reaches 1
      if (t < 1) {
        requestAnimationFrame(update);
      }
    };
    // Start the animation loop
    update();
  };


  // Function to play the viseme animation based on the input data
  const playVisemeAnimation = () => {
    let lastViseme = null; // Track the previous viseme

    visemeData.forEach(({ t, v }, index) => {
      const visemeName = visemeMap[v]; // Map the viseme symbol to the morph target name
      const isSilent = v === "-"; // Check if the viseme represents silence
      
      setTimeout(() => {
        // Gradually reset the previous viseme
        if (lastViseme && visemeMap[lastViseme]) {
          lerpInfluence(visemeMap[lastViseme], 0, 400); // Reset over 300ms
        }

        // Gradually apply the current viseme
        if (!isSilent && visemeName) {
          lerpInfluence(visemeName, 1, 400); // Apply over 300ms
        }

        lastViseme = v; // Update the last viseme
      }, t * 1000); // Convert time to milliseconds
    });

    // Reset all morph target influences at the end of the animation
    if (!setupMode){
      const lastTime = visemeData[visemeData.length - 1].t; // Get the last viseme's timestamp
      setTimeout(() => {
        if (!group.current) {
          console.error('Object is undefined');
        } else {
          group.current.traverse((child) => {
            if (child.isSkinnedMesh && child.morphTargetInfluences) {
              child.morphTargetInfluences.fill(0); // Reset all influences to 0
            }
          });
        }
        console.log("Reset all morph target influences.");
      }, (lastTime + 0.5) * 1000); // Add 500ms delay to ensure smooth reset
    }
    
  };

  // Full Body Animations
    const { animations } = useGLTF("/models/testanimations.glb");
  
    const { actions, mixer } = useAnimations(animations, group);
    const [animation, setAnimation] = useState(
      animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name // Check if Idle animation exists otherwise use first animation
    );
    useEffect(() => {
      actions[animation]
        .reset()
        .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
        .play();
      return () => actions[animation].fadeOut(0.5);
    }, [animation]);
  
  
    const lerpMorphTarget = (target, value, speed = 0.1) => {
      scene.traverse((child) => {
        if (child.isSkinnedMesh && child.morphTargetDictionary) {
          const index = child.morphTargetDictionary[target];
          if (
            index === undefined ||
            child.morphTargetInfluences[index] === undefined
          ) {
            return;
          }
          child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
            child.morphTargetInfluences[index],
            value,
            speed
          );
  
          if (!setupMode) {
            try {
              set({
                [target]: value,
              });
            } catch (e) {}
          }
        }
      });
    };
  
    const [blink, setBlink] = useState(false);
    const [winkLeft, setWinkLeft] = useState(false);
    const [winkRight, setWinkRight] = useState(false);
    const [facialExpression, setFacialExpression] = useState("");
    const [audio, setAudio] = useState();
  
    // Blinking
    useFrame(() => {
      !setupMode &&
        Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
          const mapping = facialExpressions[facialExpression];
          if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
            return; // eyes wink/blink are handled separately
          }
          if (mapping && mapping[key]) {
            lerpMorphTarget(key, mapping[key], 0.1);
          } else {
            lerpMorphTarget(key, 0, 0.1);
          }
        });
  
      lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
      lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);
    });



  // Leva Controls
    useControls("FacialExpressions", {
      chat: button(() => chat()),
      winkLeft: button(() => {
        setWinkLeft(true);
        setTimeout(() => setWinkLeft(false), 300);
      }),
      winkRight: button(() => {
        setWinkRight(true);
        setTimeout(() => setWinkRight(false), 300);
      }),
      testVisemes: button(() => {
        playVisemeAnimation()
      }),
      animation: {
        value: animation,
        options: animations.map((a) => a.name),
        onChange: (value) => setAnimation(value),
      },
      facialExpression: {
        options: Object.keys(facialExpressions),
        onChange: (value) => setFacialExpression(value),
      },
      enableSetupMode: button(() => {
        setupMode = true;
      }),
      disableSetupMode: button(() => {
        setupMode = false;
      }),
      logMorphTargetValues: button(() => {
        const emotionValues = {};
        Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
          if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
            return; // eyes wink/blink are handled separately
          }
          const value =
            nodes.EyeLeft.morphTargetInfluences[
              nodes.EyeLeft.morphTargetDictionary[key]
            ];
          if (value > 0.01) {
            emotionValues[key] = value;
          }
        });
        console.log(JSON.stringify(emotionValues, null, 2));
      }),
    });
  
    const [, set] = useControls("MorphTarget", () =>
      Object.assign(
        {},
        ...Object.keys(nodes.EyeLeft.morphTargetDictionary).map((key) => {
          return {
            [key]: {
              label: key,
              value: 0,
              min: nodes.EyeLeft.morphTargetInfluences[
                nodes.EyeLeft.morphTargetDictionary[key]
              ],
              max: 1,
              onChange: (val) => {
                if (setupMode) {
                  //CURRENTLY DOESN'T WORK AS INTENDED AND WILL RESET VISEMES IMMEDIATELY
                  lerpInfluence(key, val, 1);
                }
              },
            },
          };
        })
      )
    );
  
  
  // Auto blinking
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
    </>
  );
}

export default TestAvatar;
