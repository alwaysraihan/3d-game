import useInput from "@/hooks/useInput";
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

let walkDirection = new THREE.Vector3();
let rotateAngle = new THREE.Vector3(0, 1.0);
let rotateQuaternion = new THREE.Quaternion();
const cameraTarget = new THREE.Vector3();
const directionOffset = ({
  forward,
  backward,
  left,
  right,
}: {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}) => {
  var directionOffset = 0;
  if (forward) {
    if (left) {
      directionOffset = Math.PI / 4; //w+a
    } else if (right) {
      directionOffset = -Math.PI / 4; //w+d
    }
  } else if (backward) {
    if (left) {
      directionOffset = Math.PI / 4 + Math.PI / 2; //s+a
    } else if (right) {
      directionOffset = -Math.PI / 4 - Math.PI / 2; //s+d
    } else {
      directionOffset = -Math.PI; //s
    }
  } else if (left) {
    directionOffset = Math.PI / 2; //a
  } else if (right) {
    directionOffset = -Math.PI / 2; //d
  }
  return directionOffset;
};

const MyPlayer = () => {
  const { forward, backward, left, right, shift, jump } = useInput();
  const currentAction = useRef("");
  const controlRef = useRef<typeof OrbitControls>();
  const camera = useThree((state) => state.camera);
  const updateCameraTarget = (moveX: number, moveZ: number) => {
    //move the camera
    camera.position.x += moveX;
    camera.position.z += moveZ;

    // update the camera target
    cameraTarget.x = model.scene.position.x;
    cameraTarget.y = model.scene.position.y + 2;
    cameraTarget.z = model.scene.position.z;

    if (controlRef.current) controlRef.current.target = cameraTarget;
  };
  const model = useGLTF("/player.glb");
  const { actions } = useAnimations(model.animations, model.scene);
  model.scene.scale.set(0.8, 0.8, 0.8);
  useEffect(() => {
    let action = "";
    if (forward || backward || left || right || shift) {
      action = "walking";
      if (shift) {
        action = "running";
      }
    } else if (jump) {
      action = "jumping";
    } else {
      action = "Idle";
    }

    if (currentAction.current != action) {
      const nextActionToPlay = actions[action];
      const current = actions[currentAction.current];
      current?.fadeOut(0.2);
      nextActionToPlay?.reset().fadeIn(0.2).play();
      currentAction.current = action;
    }
  }, [forward, backward, left, right, shift, jump, actions]);
  useFrame((state, delta) => {
    if (
      currentAction.current === "running" ||
      currentAction.current === "walking"
    ) {
      //   calculate towards camera direction
      let angleYCameraDirection = Math.atan2(
        camera.position.x - model.scene.position.x,
        camera.position.z - model.scene.position.z
      );

      // diagonal movement angle offset
      let newDirectionOffset = directionOffset({
        forward,
        backward,
        left,
        right,
      });
      //rotate mode
      rotateQuaternion.setFromAxisAngle(
        rotateAngle,
        angleYCameraDirection + newDirectionOffset
      );
      model.scene.quaternion.rotateTowards(rotateQuaternion, 0.2);
      //calculate direction
      camera.getWorldDirection(walkDirection);
      walkDirection.y = 0;
      walkDirection.normalize();
      walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset);
      //run/walk velocity
      const velocity = currentAction.current === "running" ? 10 : 5;

      // move model & camera
      const moveX = walkDirection.x * velocity * delta;
      const moveZ = walkDirection.z * velocity * delta;
      model.scene.position.x += moveX;
      model.scene.position.z += moveZ;
      updateCameraTarget(moveX, moveZ);
    }
  });
  return (
    <>
      <OrbitControls ref={controlRef} />
      <primitive object={model.scene} />
    </>
  );
};

export default MyPlayer;
