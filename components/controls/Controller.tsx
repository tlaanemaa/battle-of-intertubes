import { useCallback } from "react";
import { INTENT } from "@/game/core";
import useGameApp from "@/hooks/useGameApp";
import Button from "./Button";
import JoyStick from "./JoyStick";
import PinchToZoom from "./PinchToZoom";

export function Controller() {
  const gameApp = useGameApp();

  const move = useCallback(
    (pos: { x: number; y: number }) => {
      if (!gameApp) return;
      gameApp.setPlayerInput(INTENT.MOVE_LEFT, Math.max(-pos.x, 0));
      gameApp.setPlayerInput(INTENT.MOVE_RIGHT, Math.max(pos.x, 0));
      gameApp.setPlayerInput(INTENT.MOVE_UP, Math.max(-pos.y, 0));
      gameApp.setPlayerInput(INTENT.MOVE_DOWN, Math.max(pos.y, 0));
    },
    [gameApp],
  );

  const shoot = useCallback(
    (pressed: boolean) => {
      if (!gameApp) return;
      gameApp.setPlayerInput(INTENT.SHOOT, pressed ? 1 : 0);
    },
    [gameApp],
  );

  const zoom = useCallback(
    (direction: number) => {
      if (!gameApp) return;
      gameApp.setPlayerInput(INTENT.ZOOM_IN, Math.max(direction, 0));
      gameApp.setPlayerInput(INTENT.ZOOM_OUT, Math.max(-direction, 0));
    },
    [gameApp],
  );

  return (
    <div className="fixed bottom-0 right-0 left-0 flex justify-between p-8 select-none touch-none">
      <PinchToZoom onZoom={zoom} />
      <JoyStick onMove={move} />
      <Button onPress={shoot} />
    </div>
  );
}
