"use client";

import { useCanvasStore } from "@/app/stores/useCanvasStore";
import { ShapeBox } from "./ShapeBox";

export const Canvas = () => {
  const shapes = useCanvasStore((state) => state.shapes);

  return (
    <div className="relative flex-1 overflow-hidden bg-pattern">
      {shapes.map((shape) => (
        <ShapeBox key={shape.id} shape={shape} />
      ))}
    </div>
  );
};
