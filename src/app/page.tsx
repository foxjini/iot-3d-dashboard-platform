'use client';

import dynamic from 'next/dynamic';
import { HeaderHUD } from '@/components/ui/HeaderHUD';
import { ControlDrawer } from '@/components/ui/ControlDrawer';
import { EventLogFeed } from '@/components/ui/EventLogFeed';
import { ExhibitionOverlay } from '@/components/ui/ExhibitionOverlay';
import { Loader2 } from 'lucide-react';

// R3F 3D Canvas는 브라우저 전용이므로 SSR 완전 해제
const SceneCanvas = dynamic(
  () => import('@/components/3d/SceneCanvas').then((mod) => mod.SceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-sm font-semibold tracking-wide">
          스마트홈 3D 가상 공간 초기화 중...
        </span>
      </div>
    ),
  }
);

export default function HomePage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900">
      {/* 1. 상단 HUD */}
      <HeaderHUD />

      {/* 2. 중앙 3D 가상 공간 Canvas */}
      <div className="absolute inset-0 z-0">
        <SceneCanvas />
      </div>

      {/* 3. 우측 컨트롤러 드로어 */}
      <ControlDrawer />

      {/* 4. 하단 실시간 시스템 로그 피드 */}
      <EventLogFeed />

      {/* 5. 전시 모드 오버레이 */}
      <ExhibitionOverlay />
    </main>
  );
}
