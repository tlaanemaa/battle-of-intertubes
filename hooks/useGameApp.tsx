import { useEffect, useState } from "react";
import { container } from "@/game/container";
import { GameApp } from "@/game/ui";

export default function useGameApp() {
  const [gameApp, setGameApp] = useState<GameApp | null>(null);
  useEffect(() => {
    const app = container.get(GameApp);
    setGameApp(app);
  }, []);
  return gameApp;
}
