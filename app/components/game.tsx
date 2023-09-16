"use client";
import { useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { MapControls, PerspectiveCamera } from "@react-three/drei";
import Ground from "./ground";
import { useGameState } from "../store/gameState";
import Entity from "./entity";

export default function Game() {
  const entities = useGameState((state) => state.entities);
  const { x: cameraX, y: cameraY } = useGameState(
    (state) => state.cameraPosition
  );

  const ninetyDeg = Math.PI / 2;
  const cameraTiltLimit = ninetyDeg / 2;

  return (
    <Canvas>
      <Ground x={cameraX} y={-cameraY} r={200} />

      <ambientLight intensity={4} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} />

      {entities.map((e) => (
        <Entity key={e.id} entity={e}></Entity>
      ))}

      <MapControls
        target={[cameraX, -cameraY, 0]}
        screenSpacePanning
        maxDistance={500}
        minDistance={1}
        minAzimuthAngle={-cameraTiltLimit}
        maxAzimuthAngle={cameraTiltLimit}
        minPolarAngle={ninetyDeg - cameraTiltLimit}
        maxPolarAngle={ninetyDeg + cameraTiltLimit}
      />

      <PerspectiveCamera makeDefault position={[cameraX, -cameraY, 10]}/>
    </Canvas>
  );
}
