"use client";

import { useEffect } from "react";

import { Toolbar } from "@/app/components/ui/Toolbar";
import { Canvas } from "@/app/components/ui/Canvas";
import { socket } from "@/app/utils/socket";
import { useCanvasStore } from "@/app/stores/useCanvasStore";

export const DesktopLayout = () => {
  const addShape = useCanvasStore((state) => state.addShape);
  const updatePosition = useCanvasStore((state) => state.updatePosition);
  const updateText = useCanvasStore((state) => state.updateText);

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "add":
          addShape(data.shape);
          break;
        case "move":
          updatePosition(data.id, Number(data.x), Number(data.y), true);
          break;
        case "updateText":
          updateText(data.id, data.text, true);
          break;
        default:
          break;
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [addShape, updatePosition, updateText]);

  return (
    <main className="w-screen h-screen bg-gray-100 flex flex-col">
      <Toolbar />
      <Canvas />
    </main>
  );
};
