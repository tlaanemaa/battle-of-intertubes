"use client";
import { Canvas } from "@react-three/fiber";
import { startGameUI } from "@/game/ui";
import { MapControls, OrbitControls, useTexture } from "@react-three/drei";
import Ground from "./ground";
import { useGameState } from "../store/gameState";
import Entity from "./entity";

export default function Game() {
  const { entities } = useGameState();

  const ninetyDeg = Math.PI / 2;
  const cameraTiltLimit = ninetyDeg / 2;

  return (
    <Canvas>
      <Ground x={0} y={0} r={2000} />

      <ambientLight intensity={4} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} />

      {entities.map((e) => (
        <Entity key={e.id} entity={e}></Entity>
      ))}

      <OrbitControls
        position={[0, 0, 500]}
        maxDistance={500}
        minDistance={1}
        minAzimuthAngle={-cameraTiltLimit}
        maxAzimuthAngle={cameraTiltLimit}
        minPolarAngle={ninetyDeg - cameraTiltLimit}
        maxPolarAngle={ninetyDeg + cameraTiltLimit}
      />
    </Canvas>
  );
}
