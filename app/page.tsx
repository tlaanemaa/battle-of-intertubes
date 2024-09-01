"use client";
import Game from "./game";
import { Controller } from "@/components/controls/Controller";

export default function Home() {
  return (
    <main>
      <canvas
        id="game-background"
        className="fixed top-0 left-0 z-[--2]"
      ></canvas>
      <canvas id="game-view" className="fixed top-0 left-0 z-[--1]"></canvas>
      <div
        id="fog"
        className="fixed top-0 left-0 h-full w-full shadow-[inset_0_0_20px_20px_black]"
      ></div>
      <Game />
      <Controller />
    </main>
  );
}
