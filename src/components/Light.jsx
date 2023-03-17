import { useHelper } from "@react-three/drei";
import React, { useRef } from "react";
import { DirectionalLight, DirectionalLightHelper, Object3D } from "three";

const Lights = () => {
  const lightRef = useRef();
  useHelper(lightRef, DirectionalLightHelper, { color: "red" });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        ref={lightRef}
        position={[0, 10, 10]}
        castShadow
        shadowMapHeight={1000}
        shadowMapWidth={1000}
        shadowCameraLeft={-20}
        shadowCameraRight={20}
        shadowCameraTop={20}
        shadowCameraBottom={-20}
      />
    </>
  );
};

export default Lights;
