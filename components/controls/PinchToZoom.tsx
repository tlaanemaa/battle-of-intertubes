"use client";
import { useCallback, useEffect, useState } from "react";

type xyCoords = { x: number; y: number };

type Props = {
  onZoom: (direction: number) => void;
};

export default function PinchToZoom({ onZoom }: Props) {
  useEffect(() => {
    let previousDist = 0;
    const handleTouch = ({ touches }: TouchEvent) => {
      if (touches.length < 2) return onZoom(0);
      const dist = Math.hypot(
        touches[0].pageX - touches[1].pageX,
        touches[0].pageY - touches[1].pageY
      );
      onZoom(Math.sign(dist - previousDist));
      previousDist = dist;
    };

    window.addEventListener("touchmove", handleTouch);
    return () => {
      window.removeEventListener("touchmove", handleTouch);
    };
  }, [onZoom]);

  useEffect(() => {
    const release = () => onZoom(0);
    window.addEventListener("touchend", release);
    return () => {
      window.removeEventListener("touchend", release);
    };
  });

  return null;
}
