"use client";
import { startGameUI } from "@/game/ui";
import { useEffect } from "react";

export default function Game() {
  useEffect(() => {
    startGameUI();
  }, []);
  return null;
}
