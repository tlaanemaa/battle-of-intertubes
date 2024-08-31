"use client";
import { useCallback, useEffect, useState, useRef } from "react";

type Props = {
  height: number;
  width: number;
  stickHeight: number;
  stickWidth: number;
  className: string;
};

export default function JoyStick({
  height = 100,
  width = height,
  stickHeight = height * 0.6,
  stickWidth = width * 0.6,
}: Props) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [landingPosition, setLandingPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const stats = event instanceof MouseEvent ? event : event.touches[0];
      const moveOffset = {
        x: stats.pageX - landingPosition.x,
        y: stats.pageY - landingPosition.y,
      };
      const maxDist = width / 2;
      const dist = Math.sqrt(moveOffset.x ** 2 + moveOffset.y ** 2);
      const ratio = Math.max(dist, maxDist) / maxDist;
      moveOffset.x /= ratio;
      moveOffset.y /= ratio;

      setPosition({
        x: moveOffset.x,
        y: moveOffset.y,
      });
    },
    [width, isDragging, landingPosition, setPosition]
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleRelease = () => setIsDragging(false);
    const handleGrab = (event: MouseEvent | TouchEvent) => {
      const stats = event instanceof MouseEvent ? event : event.touches[0];
      setLandingPosition({ x: stats.pageX, y: stats.pageY });
      setIsDragging(true);
    };

    node.addEventListener("mousedown", handleGrab);
    window.addEventListener("mouseup", handleRelease);
    node.addEventListener("touchstart", handleGrab);
    window.addEventListener("touchend", handleRelease);

    return () => {
      node.removeEventListener("mousedown", handleGrab);
      window.removeEventListener("mouseup", handleRelease);
      node.removeEventListener("touchstart", handleGrab);
      window.removeEventListener("touchend", handleRelease);
    };
  }, [ref]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, [handleMove]);

  useEffect(() => {
    if (!isDragging) {
      setPosition({ x: 0, y: 0 });
      setLandingPosition({ x: 0, y: 0 });
    }
  }, [isDragging]);

  return (
    <div
      className="fixed"
      style={{
        bottom: `${stickHeight / 2 + 5}px`,
        left: `${stickWidth / 2 + 5}px`,
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      <div className="absolute opacity-50 bg-white rounded-full inset-0"></div>
      <div
        ref={ref}
        className="absolute bg-white rounded-full z-10 cursor-pointer"
        style={{
          top: `${height * 0.5 - stickHeight * 0.5}px`,
          left: `${width * 0.5 - stickWidth * 0.5}px`,
          height: `${stickHeight}px`,
          width: `${stickWidth}px`,
          opacity: isDragging ? 0.7 : 0.5,
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      ></div>
    </div>
  );
}
