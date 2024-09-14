"use client";
import { useEffect, useState, useRef, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  height?: number;
  width?: number;
  className?: string;
  onPress: (pressed: boolean) => void;
}

export default function Button({
  height = 100,
  width = height,
  className,
  onPress,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pressed, setPressed] = useState(false);

  // Handle press event
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handlePress = (event: MouseEvent | TouchEvent) => {
      event.stopPropagation();
      event.preventDefault();
      setPressed(true);
    };

    element.addEventListener("mousedown", handlePress);
    element.addEventListener("touchstart", handlePress);

    return () => {
      element.removeEventListener("mousedown", handlePress);
      element.removeEventListener("touchstart", handlePress);
    };
  }, [ref]);

  // Handle release event
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleRelease = (event: MouseEvent | TouchEvent) => {
      event.stopPropagation();
      event.preventDefault();
      setPressed(false);
    };

    element.addEventListener("mouseup", handleRelease);
    element.addEventListener("touchend", handleRelease);

    return () => {
      element.removeEventListener("mouseup", handleRelease);
      element.removeEventListener("touchend", handleRelease);
    };
  }, [ref]);

  // Send pressed state to parent component
  useEffect(() => {
    onPress(pressed);
  }, [pressed, onPress]);

  const classes = [
    "flex items-center justify-center",
    "bg-white rounded-full cursor-pointer",
    pressed ? "bg-opacity-70" : "bg-opacity-50",
    className,
  ];

  return (
    <div
      ref={ref}
      className={classes.filter(Boolean).join(" ")}
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      {children}
    </div>
  );
}
