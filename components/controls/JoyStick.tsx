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
      const coords = "touches" in event ? event.touches[0] : event;
      setLandingPosition({ x: coords.pageX, y: coords.pageY });
      setIsDragging(true);
    };

    elem.addEventListener("mousedown", handleGrab, { passive: false });
    elem.addEventListener("touchstart", handleGrab, { passive: false });
    return () => {
      elem.removeEventListener("mousedown", handleGrab);
      elem.removeEventListener("touchstart", handleGrab);
    };
  }, []);

  useEffect(() => {
    const elem = ref.current;
    if (!elem) return;

    const handleRelease = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
    };

    elem.addEventListener("mouseup", handleRelease, { passive: false });
    elem.addEventListener("touchend", handleRelease, { passive: false });

    return () => {
      elem.removeEventListener("mouseup", handleRelease);
      elem.removeEventListener("touchend", handleRelease);
    };
  }, [ref]);

  useEffect(() => {
    const elem = ref.current;
    if (!elem) return;

    const handleMove = (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      event.preventDefault();
      event.stopPropagation();

      const stats = event instanceof MouseEvent ? event : event.touches[0];
      const moveOffset = {
        x: stats.pageX - landingPosition.x,
        y: stats.pageY - landingPosition.y,
      };
      // const maxDist = width * MAX_DIST_MULTIPLIER;
      // const dist = Math.sqrt(moveOffset.x ** 2 + moveOffset.y ** 2);
      // const ratio = Math.max(dist, maxDist) / maxDist;
      // moveOffset.x /= ratio;
      // moveOffset.y /= ratio;

      setPosition({
        x: moveOffset.x,
        y: moveOffset.y,
      });
    };

    elem.addEventListener("mousemove", handleMove, { passive: false });
    elem.addEventListener("touchmove", handleMove, { passive: false });
    return () => {
      elem.removeEventListener("mousemove", handleMove);
      elem.removeEventListener("touchmove", handleMove);
    };
  }, [ref, isDragging, landingPosition]);

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
