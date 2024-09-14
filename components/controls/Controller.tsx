import { useCallback } from "react";
import { INTENT } from "@/game/core";
import useGameApp from "@/hooks/useGameApp";
import Button from "./Button";
import JoyStick from "./JoyStick";
import { IconRocket, IconPlus, IconMinus } from "@tabler/icons-react";
import { KeyboardControls } from "./KeyboardControls";

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

  const zoomIn = useCallback(
    (pressed: boolean) => {
      if (!gameApp) return;
      gameApp.setPlayerInput(INTENT.ZOOM_IN, pressed ? 1 : 0);
    },
    [gameApp],
  );

  const zoomOut = useCallback(
    (pressed: boolean) => {
      if (!gameApp) return;
      gameApp.setPlayerInput(INTENT.ZOOM_OUT, pressed ? 1 : 0);
    },
    [gameApp],
  );

  const iconColor = "#000033";

  return (
    <>
      <KeyboardControls
        onMove={move}
        onShoot={shoot}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
      />
      <div className="fixed bottom-top right-0 flex flex-col gap-2 justify-between p-2 select-none touch-none">
        <Button height={50} onPress={zoomIn}>
          <IconPlus opacity={0.4} color={iconColor} size={32} />
        </Button>
        <Button height={50} onPress={zoomOut}>
          <IconMinus opacity={0.4} color={iconColor} size={32} />
        </Button>
      </div>
      <div className="fixed bottom-0 right-0 left-0 flex gap-5 justify-between p-8 select-none touch-none">
        <JoyStick onMove={move} />
        <Button onPress={shoot}>
          <IconRocket opacity={0.4} color={iconColor} size={42} />
        </Button>
      </div>
    </>
  );
}
