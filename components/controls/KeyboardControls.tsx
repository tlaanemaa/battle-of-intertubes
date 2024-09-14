import { on } from "events";
import { useEffect } from "react";

type Props = {
  onMove: (position: { x: number; y: number }) => void;
  onZoomIn: (pressed: boolean) => void;
  onZoomOut: (pressed: boolean) => void;
  onShoot: (pressed: boolean) => void;
};

export function KeyboardControls({
  onMove,
  onZoomIn,
  onZoomOut,
  onShoot,
}: Props) {
  useEffect(() => {
    const keyState = { w: false, a: false, s: false, d: false, space: false };

    const resolveKeyState = () => {
      onShoot(keyState.space);
      onMove({
        x: (keyState.d ? 1 : 0) - (keyState.a ? 1 : 0),
        y: (keyState.s ? 1 : 0) - (keyState.w ? 1 : 0),
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const key = event.key.toLowerCase();
      if (key === "w" || key === "arrowup") {
        keyState.w = true;
      } else if (key === "a" || key === "arrowleft") {
        keyState.a = true;
      } else if (key === "s" || key === "arrowdown") {
        keyState.s = true;
      } else if (key === "d" || key === "arrowright") {
        keyState.d = true;
      } else if (key === " ") {
        keyState.space = true;
      }
      resolveKeyState();
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const key = event.key.toLowerCase();
      if (key === "w" || key === "arrowup") {
        keyState.w = false;
      } else if (key === "a" || key === "arrowleft") {
        keyState.a = false;
      } else if (key === "s" || key === "arrowdown") {
        keyState.s = false;
      } else if (key === "d" || key === "arrowright") {
        keyState.d = false;
      } else if (key === " ") {
        keyState.space = false;
      }
      resolveKeyState();
    };

    let zoomResetTimeout: NodeJS.Timeout;
    const handleScroll = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      clearTimeout(zoomResetTimeout);
      if (event.deltaY < 0) {
        onZoomIn(true);
        onZoomOut(false);
      } else {
        onZoomOut(true);
        onZoomIn(false);
      }
      zoomResetTimeout = setTimeout(() => {
        onZoomIn(false);
        onZoomOut(false);
      }, 100);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("wheel", handleScroll);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleScroll);
    };
  }, [onMove, onShoot, onZoomIn, onZoomOut]);

  return null;
}
