"use client";
import { useCallback, useEffect, useState } from "react";

type Props = {
  height?: number;
  width?: number;
  stickHeight?: number;
  stickWidth?: number;
  className?: string;
  onMove: (position: { x: number; y: number }) => void;
};

const MAX_DIST_MULTIPLIER = 0.4;

export default function JoyStick({
  height = 100,
  width = height,
  stickHeight = height * 0.6,
  stickWidth = width * 0.6,
  className = "",
  onMove,
}: Props) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [landingPosition, setLandingPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleRelease = useCallback((event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleGrab = useCallback((event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    const coords = "touches" in event ? event.touches[0] : event;
    setLandingPosition({ x: coords.pageX, y: coords.pageY });
    setIsDragging(true);
  }, []);

  const handleMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      if (!isDragging) return;
      const stats = event instanceof MouseEvent ? event : event.touches[0];
      const moveOffset = {
        x: stats.pageX - landingPosition.x,
        y: stats.pageY - landingPosition.y,
      };
      const maxDist = width * MAX_DIST_MULTIPLIER;
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
    window.addEventListener("mouseup", handleRelease);
    window.addEventListener("touchend", handleRelease);

    return () => {
      window.removeEventListener("mouseup", handleRelease);
      window.removeEventListener("touchend", handleRelease);
    };
  }, [handleRelease]);

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

  useEffect(() => {
    onMove({
      x: position.x / (width * MAX_DIST_MULTIPLIER),
      y: position.y / (height * MAX_DIST_MULTIPLIER),
    });
  }, [width, height, position, onMove]);

  return (
    <div
      className={`relative ${className}`}
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      <div className="absolute 8 inset-0 bg-white rounded-full opacity-50 select-none"></div>
      <div
        onMouseDown={handleGrab as any}
        onTouchStart={handleGrab as any}
        className="absolute bg-white rounded-full z-10 cursor-pointer select-none"
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
