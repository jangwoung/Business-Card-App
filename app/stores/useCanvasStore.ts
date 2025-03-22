import { create } from "zustand";
import { socket } from "@/app/utils/socket";
import { v4 as uuidv4 } from "uuid";

export type Shape = {
  id: string;
  x: number;
  y: number;
  text: {
    name: string;
    email: string;
    address: string;
  };
};

type CanvasState = {
  shapes: Shape[];
  // 第2引数 fromExternal を追加
  addShape: (partialShape?: Partial<Shape>, fromExternal?: boolean) => void;
  updatePosition: (
    id: string,
    x: number,
    y: number,
    external?: boolean
  ) => void;
  updateText: (
    id: string,
    newText: { name: string; email: string; address: string },
    external?: boolean
  ) => void;
};

export const useCanvasStore = create<CanvasState>((set) => ({
  shapes: [],
  addShape: (partialShape, fromExternal = false) => {
    const newShape: Shape = {
      id: partialShape?.id || uuidv4(),
      x: partialShape?.x ?? 100,
      y: partialShape?.y ?? 100,
      text: partialShape?.text || {
        name: "新しい図形",
        email: "",
        address: "",
      },
    };

    // すでに同じIDが存在する場合は追加しない
    set((state) => {
      const exists = state.shapes.some((s) => s.id === newShape.id);
      if (exists) {
        console.warn("Duplicate shape ID detected:", newShape.id);
        return state;
      }
      return { shapes: [...state.shapes, newShape] };
    });

    // ローカル作成の場合のみWebSocket送信
    if (!fromExternal && socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "add", shape: newShape }));
    }
  },

  updatePosition: (id, x, y, external = false) => {
    set((state) => ({
      shapes: state.shapes.map((s) => (s.id === id ? { ...s, x, y } : s)),
    }));

    if (!external && socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "move", id, x, y }));
    }
  },

  updateText: (id, newText, external = false) => {
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === id ? { ...s, text: newText } : s
      ),
    }));

    if (!external && socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "updateText", id, text: newText }));
    }
  },
}));
