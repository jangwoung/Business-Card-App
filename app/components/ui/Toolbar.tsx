"use client";

import { useCanvasStore } from "@/app/stores/useCanvasStore";

export const Toolbar = () => {
  const addShape = useCanvasStore((state) => state.addShape);

  return (
    <div className="p-4 shadow">
      <button
        onClick={() => addShape()}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        図形を追加
      </button>
    </div>
  );
};
