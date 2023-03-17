import { NextPage } from "next";
import { Canvas, act, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
// import AnimatedBox from "../../components/AnimatedBox";
import TreeModel from "../components/Tree";
import {
  OrbitControls,
  Stats,
  Torus,
  TransformControls,
  useAnimations,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import Lights from "../components/Light";
import useInput from "@/hooks/useInput";
import MyPlayer from "@/components/Player";

const testing = true;

const Home: NextPage = () => {
  return (
    <div className="container">
      <Canvas shadows camera={{ position: [0, 0, 10] }}>
        {/* <axesHelper args={[2]} visible={testing} /> */}
        {/* <gridHelper args={[1000, 1000]} visible={testing} /> */}
        <OrbitControls
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 20}
          // maxZoom={1}
          minDistance={1}
          maxDistance={10}
        />
        {/* <Stats /> */}
        {/* <AnimatedBox /> */}

        <TreeModel boundary={50} count={100} />
        {/* <TexturedSpheres/> */}
        <Lights />
        <MyPlayer />
        <mesh rotation-x={Math.PI * -0.5} receiveShadow>
          <planeBufferGeometry args={[1000, 1000]} />
          <meshStandardMaterial color={"#458745"} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Home;
