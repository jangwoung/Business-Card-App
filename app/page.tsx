"use client";

import { DesktopLayout } from "./components/layout/DesktopLayout";
import { MobileLayout } from "./components/layout/MobileLayout";

import { useIsMobile } from "./hooks/useIsMobile";

export default function HomePage() {
  const isMobile = useIsMobile();

  return (
    <main className="w-screen h-screen bg-gray-100">
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </main>
  );
}
