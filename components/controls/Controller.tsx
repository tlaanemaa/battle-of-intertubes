import { useCallback } from "react";
import { INTENT } from "@/game/core";
import useGameApp from "@/hooks/useGameApp";
import Button from "./Button";
import JoyStick from "./JoyStick";

export function Controller() {
  const gameApp = useGameApp();

  const move = useCallback(
    (pos: { x: number; y: number }) => {
      if (pos.x < 0) {
        gameApp?.sendPlayerInput(INTENT.MOVE_LEFT);
      }
      if (pos.x > 0) {
        gameApp?.sendPlayerInput(INTENT.MOVE_RIGHT);
      }
      if (pos.y < 0) {
        gameApp?.sendPlayerInput(INTENT.MOVE_UP);
      }
      if (pos.y > 0) {
        gameApp?.sendPlayerInput(INTENT.MOVE_DOWN);
      }
    },
    [gameApp],
  );

  const shoot = useCallback(() => {
    gameApp?.sendPlayerInput(INTENT.SHOOT);
  }, [gameApp]);

  return (
    <div>
      <JoyStick className="bottom-8 left-8" onMove={move} />
      <Button className="bottom-8 right-8" onPress={shoot} />
    </div>
  );
}
