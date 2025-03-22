"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@/app/components/ui/Canvas";
import { socket } from "@/app/utils/socket";
import { useCanvasStore } from "@/app/stores/useCanvasStore";

export const MobileLayout = () => {
  const addShape = useCanvasStore((state) => state.addShape);
  const updatePosition = useCanvasStore((state) => state.updatePosition);
  const updateText = useCanvasStore((state) => state.updateText);

  // 最新の関数を保持する refs を用意
  const addShapeRef = useRef(addShape);
  const updatePositionRef = useRef(updatePosition);
  const updateTextRef = useRef(updateText);

  // store の関数が更新されたときに refs を更新
  useEffect(() => {
    addShapeRef.current = addShape;
    updatePositionRef.current = updatePosition;
    updateTextRef.current = updateText;
  }, [addShape, updatePosition, updateText]);

  // この useEffect は一度だけ実行する
  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "add":
          addShapeRef.current(data.shape, true);
          break;
        case "move":
          updatePositionRef.current(
            data.id,
            Number(data.x),
            Number(data.y),
            true
          );
          break;
        case "updateText":
          updateTextRef.current(data.id, data.text, true);
          break;
        default:
          break;
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, []); // 空の依存配列により、一度だけ登録される

  // 以下、モバイル用のUI実装
  const [showCard, setShowCard] = useState(true);
  const [cardDetails, setCardDetails] = useState({
    name: "",
    email: "",
    address: "",
  });

  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const swipeThreshold =
    typeof window !== "undefined" ? window.innerHeight * 0.4 : 200;

  const handleTouchStart = (e: React.TouchEvent) => {
    const y = e.touches[0].clientY;
    touchStartY.current = y;
    touchEndY.current = y;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartY.current - touchEndY.current;
    if (swipeDistance > swipeThreshold) {
      // ローカル作成の場合は fromExternal を false（既定値）として呼び出す
      addShape({ text: cardDetails });
      setShowCard(false);
    }
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  return (
    <main className="w-screen h-screen bg-gray-100 flex flex-col relative">
      <Canvas />
      {showCard && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-lg rounded-t-lg"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <h2 className="text-xl font-bold mb-2 text-center">名刺情報を入力</h2>
          <div className="mb-2">
            <label className="block text-sm">Name:</label>
            <input
              type="text"
              value={cardDetails.name}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, name: e.target.value })
              }
              className="w-full border rounded p-1"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Email:</label>
            <input
              type="email"
              value={cardDetails.email}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, email: e.target.value })
              }
              className="w-full border rounded p-1"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Address:</label>
            <input
              type="text"
              value={cardDetails.address}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, address: e.target.value })
              }
              className="w-full border rounded p-1"
            />
          </div>
          <p className="text-sm text-gray-500 text-center">
            上にスワイプして送信
          </p>
        </div>
      )}
    </main>
  );
};
