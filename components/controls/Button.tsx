"use client";
import { useEffect, useState } from "react";

type Props = {
  height?: number;
  width?: number;
  className?: string;
  onPress: () => void;
  pressInterval?: number;
};

export default function Button({
  height = 100,
  width = height,
  className,
  onPress,
  pressInterval = 100,
}: Props) {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const triggerPresses = () => {
      if (!pressed) return;
      onPress();
      timeout = setTimeout(triggerPresses, pressInterval);
    };
    triggerPresses();
    return () => clearTimeout(timeout);
  }, [pressed, onPress, pressInterval]);

  useEffect(() => {
    const handleRelease = () => setPressed(false);
    window.addEventListener("mouseup", handleRelease);
    window.addEventListener("touchend", handleRelease);

    return () => {
      window.removeEventListener("mouseup", handleRelease);
      window.removeEventListener("touchend", handleRelease);
    };
  }, []);

  const classes = [
    "fixed bg-white rounded-full cursor-pointer",
    pressed ? "opacity-70" : "opacity-50",
    className,
  ];

  return (
    <div
      className={classes.filter(Boolean).join(" ")}
      onMouseDown={() => setPressed(true)}
      onTouchStart={() => setPressed(true)}
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
    ></div>
  );
}
