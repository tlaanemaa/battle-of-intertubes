import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface GroundProps {
  r: number;
  x: number;
  y: number;
}

export default function Ground(props: GroundProps) {
  const texture = useTexture("/img/grass.jpg");
  const textureScale = 100;

  const repeats = Math.max(1, Math.round(props.r / textureScale));
  const offsetDivisor = (props.r * 2) / repeats;

  texture.wrapT = THREE.RepeatWrapping;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(repeats, repeats);
  texture.offset.set(props.x / offsetDivisor, props.y / offsetDivisor);

  return (
    <mesh scale={[1, 1, 1]} position={[props.x, props.y, 0]}>
      <circleGeometry args={[props.r]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
