"use client";

import type React from "react";

import { useRef } from "react";
import { type Shape, useCanvasStore } from "@/app/stores/useCanvasStore";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, MapPin } from "lucide-react";

type Props = {
  shape: Shape;
};

export const ShapeBox = ({ shape }: Props) => {
  const updatePosition = useCanvasStore((state) => state.updatePosition);
  const updateText = useCanvasStore((state) => state.updateText);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - shape.x,
      y: e.clientY - shape.y,
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragging.current) return;
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    updatePosition(shape.id, newX, newY);
  };

  const handlePointerUp = () => {
    dragging.current = false;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  return (
    <Card
      onPointerDown={handlePointerDown}
      className="absolute w-[364px] h-[220px] rounded-md shadow-md cursor-move select-none overflow-hidden"
      style={{ top: shape.y, left: shape.x }}
    >
      <div className="h-8 bg-primary w-full"></div>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="space-y-1">
            <Input
              className="text-xl font-semibold border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={shape.text.name}
              onChange={(e) =>
                updateText(shape.id, { ...shape.text, name: e.target.value })
              }
              placeholder="Your Name"
            />
          </div>
        </div>
        <div className="h-px bg-border w-full my-2"></div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Input
              className="border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={shape.text.email}
              onChange={(e) =>
                updateText(shape.id, { ...shape.text, email: e.target.value })
              }
              placeholder="email@example.com"
            />
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Input
              className="border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={shape.text.address}
              onChange={(e) =>
                updateText(shape.id, { ...shape.text, address: e.target.value })
              }
              placeholder="123 Business Street, City"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
