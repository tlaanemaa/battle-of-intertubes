import { Box } from "@react-three/drei";
import { PerlinNoise } from "../util/Perlin";

// Create a noise generator
const noiseGenerator = new PerlinNoise(Math.random())

type Props = {
  x: number;
  y: number;
  w: number;
  h: number;
  boxSize?: number;
};

function calculateNaturalLandscape(x: number, y: number): number {
  // Parameters for the landscape generation
  const scale = 0.01; // Adjust the scale to control the level of detail
  const amplitude = 10; // Adjust the amplitude to change the landscape height
  
  // Generate Perlin noise values for the given (x, y) coordinates
  const noiseValue = noiseGenerator.noise(x * scale, y * scale);

  // Map the noise value to the desired amplitude and return it
  const z = amplitude * noiseValue;
  
  return z;
}

function randomColorInRange(
  minRed: number,
  maxRed: number,
  minGreen: number,
  maxGreen: number,
  minBlue: number,
  maxBlue: number
): string {
  if (
    minRed < 0 ||
    maxRed > 255 ||
    minGreen < 0 ||
    maxGreen > 255 ||
    minBlue < 0 ||
    maxBlue > 255 ||
    minRed > maxRed ||
    minGreen > maxGreen ||
    minBlue > maxBlue
  ) {
    throw new Error("Invalid color range");
  }

  const randomChannel = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const randomRed = randomChannel(minRed, maxRed);
  const randomGreen = randomChannel(minGreen, maxGreen);
  const randomBlue = randomChannel(minBlue, maxBlue);

  const toHex = (value: number) => value.toString(16).padStart(2, "0");
  const colorCode = `#${toHex(randomRed)}${toHex(randomGreen)}${toHex(
    randomBlue
  )}`;

  return colorCode;
}

export default function Ground(props: Props) {
  const xStart = props.x - props.w / 2;
  const yStart = props.y - props.h / 2;
  const boxSize = props.boxSize || 1;

  const blocks = [];
  for (let x = xStart; x < props.w; x += boxSize) {
    for (let y = yStart; y < props.h; y += boxSize) {
      const z = calculateNaturalLandscape(x, y);
      blocks.push(
        <Box
          key={`${x}-${y}-${z}`}
          args={[boxSize, boxSize, boxSize]}
          position={[x, y, z]}
        >
          <meshStandardMaterial
            color={randomColorInRange(100, 150, 40, 90, 0, 0)}
          />
        </Box>
      );
    }
  }

  return <>{blocks}</>;
}
