"use client";
import {
  useCallback,
  useEffect,
  useState,
  MouseEvent,
  TouchEvent,
} from "react";

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

  const handlePress = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.stopPropagation();
      event.preventDefault();
      setPressed(true);
    },
    [setPressed]
  );

  const handleRelease = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.stopPropagation();
      event.preventDefault();
      setPressed(false);
    },
    [setPressed]
  );

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

  const classes = [
    "bg-white rounded-full cursor-pointer",
    pressed ? "opacity-70" : "opacity-50",
    className,
  ];

  return (
    <div
      className={classes.filter(Boolean).join(" ")}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
    ></div>
  );
}
