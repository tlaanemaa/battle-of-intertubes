"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  height?: number;
  width?: number;
  stickHeight?: number;
  stickWidth?: number;
  className?: string;
  onMove: (position: { x: number; y: number }) => void;
};

const MAX_DIST_MULTIPLIER = 0.4;

const leftMostTouch = (event: TouchEvent) =>
  Array.from(event.touches).sort((a, b) => a.clientX - b.clientX)[0];

export default function JoyStick({
  height = 100,
  width = height,
  stickHeight = height * 0.6,
  stickWidth = width * 0.6,
  className = "",
  onMove,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [landingPosition, setLandingPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const elem = ref.current;
    if (!elem) return;

    const handleGrab = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const coords = "touches" in event ? leftMostTouch(event) : event;
      setLandingPosition({ x: coords.pageX, y: coords.pageY });
      setIsDragging(true);
    };

    elem.addEventListener("mousedown", handleGrab, { passive: false });
    elem.addEventListener("touchstart", handleGrab, { passive: false });
    return () => {
      elem.removeEventListener("mousedown", handleGrab);
      elem.removeEventListener("touchstart", handleGrab);
    };
  }, [ref]);

  useEffect(() => {
    const handleRelease = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleRelease, { passive: false });
    window.addEventListener("touchend", handleRelease, { passive: false });

    return () => {
      window.removeEventListener("mouseup", handleRelease);
      window.removeEventListener("touchend", handleRelease);
    };
  }, []);

  useEffect(() => {
    const elem = ref.current;
    if (!elem) return;

    const handleMove = (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      event.preventDefault();
      event.stopPropagation();

      const stats = event instanceof MouseEvent ? event : leftMostTouch(event);
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
    };

    window.addEventListener("mousemove", handleMove, { passive: false });
    window.addEventListener("touchmove", handleMove, { passive: false });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, [width, isDragging, landingPosition]);

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
        ref={ref}
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
