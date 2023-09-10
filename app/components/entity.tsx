import { useTexture } from "@react-three/drei";
import { Entity as IEntity } from "@/game/core";

interface EntityProps {
  entity: IEntity;
}

export default function Entity({ entity }: EntityProps) {
  const texture = useTexture(entity.texturePath!); // TODO: Change the texture path to be required

  return (
    <mesh
      scale={[1, 1, 1]}
      position={[entity.x, -entity.y, 0.1]}
      rotation={[0, 0, (-entity.rotation * Math.PI) / 180]}
    >
      <planeGeometry args={[entity.width, entity.height]} />
      <meshStandardMaterial transparent map={texture} />
    </mesh>
  );
}
