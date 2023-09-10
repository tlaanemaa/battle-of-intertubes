"use client";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MapControls, OrbitControls, useTexture } from "@react-three/drei";
import Ground from "./ground";

function Box(props: any) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<any>();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.z += delta));
  // Return the view, these are regular Threejs elements expressed in JSX

  const tex = useTexture("/img/moose.png");
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial transparent map={tex} color={hovered ? "yellow" : "white"} />
    </mesh>
  );
}

function Scene() {
  const ninetyDeg = Math.PI / 2;
  const cameraTiltLimit = ninetyDeg / 4;

  const [bgX, setBgX] = useState(0);
  const [bgY, setBgY] = useState(0);

  useFrame(() => {
    setBgX(bgX + 0.01);
    setBgY(bgY + 0.01);
  });

  return (
    <>
      <ambientLight intensity={4} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} />

      <Ground x={Math.sin(bgX) * 2} y={Math.cos(bgY) * 2} r={10} />

      <Box position={[-1.2, 0, 0.1]} />
      <Box position={[1.2, 0, 0.1]} />

      <OrbitControls
        position={[0, 0, 0]}
        maxDistance={200}
        minDistance={1}
        minAzimuthAngle={-cameraTiltLimit}
        maxAzimuthAngle={cameraTiltLimit}
        minPolarAngle={ninetyDeg - cameraTiltLimit}
        maxPolarAngle={ninetyDeg + cameraTiltLimit}
      />
    </>
  );
}

export default function RenderDemo() {
  return (
    <Canvas>
      <Scene />
    </Canvas>
  );
}
