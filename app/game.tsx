"use client";
import { useEffect } from "react";
import useGameApp from "@/hooks/useGameApp";

export default function Game() {
  const gameApp = useGameApp();
  useEffect(() => {
    gameApp?.start();
  }, [gameApp]);
  return null;
}
