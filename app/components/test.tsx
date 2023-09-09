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
      <boxGeometry args={[1, 1, 0]} />
      <meshStandardMaterial map={tex} color={hovered ? "yellow" : "white"} />
    </mesh>
  );
}

function Background() {
  const grassTexture = useTexture("/img/grass.jpg");

  return (
    <mesh>
      <planeGeometry args={[5, 5]} />
      <meshStandardMaterial map={grassTexture} />
    </mesh>
  );
}

export default function RenderDemo() {
  return (
    <Canvas>
      <ambientLight intensity={4} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} />

      <Ground x={0} y={0} h={50} w={50} boxSize={1} />

      <Box position={[-1.2, 0, 2]} />
      <Box position={[1.2, 0, 2]} />

      <OrbitControls />
    </Canvas>
  );
}
