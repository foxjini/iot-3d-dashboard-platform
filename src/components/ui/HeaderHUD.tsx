'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIoTStore } from '@/core/store/useIoTStore';
import {
  Activity,
  Cpu,
  Monitor,
  Maximize,
  BookOpen,
  Settings,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export function HeaderHUD() {
  const mode = useIoTStore((s) => s.mode);
  const setMode = useIoTStore((s) => s.setMode);
  const connectionState = useIoTStore((s) => s.connectionState);
  const picoIpAddress = useIoTStore((s) => s.picoIpAddress);
  const setPicoIpAddress = useIoTStore((s) => s.setPicoIpAddress);
  const isExhibitionMode = useIoTStore((s) => s.isExhibitionMode);
  const setExhibitionMode = useIoTStore((s) => s.setExhibitionMode);
  const isAutoRotate = useIoTStore((s) => s.isAutoRotate);
  const setAutoRotate = useIoTStore((s) => s.setAutoRotate);

  const [showIpModal, setShowIpModal] = useState(false);
  const [tempIp, setTempIp] = useState(picoIpAddress);

  // 전시 모드 (Fullscreen & WakeLock) 토글
  const toggleExhibition = async () => {
    if (!isExhibitionMode) {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        if ('wakeLock' in navigator) {
          await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        console.warn('Fullscreen/WakeLock error:', err);
      }
      setExhibitionMode(true);
    } else {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setExhibitionMode(false);
    }
  };

  const handleSaveIp = () => {
    setPicoIpAddress(tempIp);
    setShowIpModal(false);
  };

  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
      {/* 1. 좌측 로고 & 연결 상태 */}
      <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/60 shadow-xl pointer-events-auto">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-sm">
          3D
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            스마트홈 3D IoT 플랫폼
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              CircuitPython
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionState === 'connected'
                  ? 'bg-emerald-400'
                  : connectionState === 'connecting'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-xs text-slate-300 font-medium">
              {mode === 'simulation'
                ? '시뮬레이터 가동 중'
                : connectionState === 'connected'
                ? `Pico 2 W (${picoIpAddress})`
                : 'Pico 2 W 연결 대기'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. 우측 제어 툴바 */}
      <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 shadow-xl pointer-events-auto">
        {/* 모드 전환 스위치 */}
        <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/50">
          <button
            onClick={() => setMode('simulation')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              mode === 'simulation'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            시뮬레이션
          </button>
          <button
            onClick={() => {
              setMode('hardware');
              setShowIpModal(true);
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              mode === 'hardware'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Pico 2 W
          </button>
        </div>

        {/* 자동 회전 토글 */}
        <button
          onClick={() => setAutoRotate(!isAutoRotate)}
          className={`p-2 rounded-lg border text-xs font-medium transition-all ${
            isAutoRotate
              ? 'bg-blue-500/20 border-blue-400 text-blue-300'
              : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
          title="3D 카메라 자동 회전"
        >
          <RotateCcw className={`w-4 h-4 ${isAutoRotate ? 'animate-spin' : ''}`} />
        </button>

        {/* 2D 대시보드 전환 */}
        <Link
          href="/2d"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          <Monitor className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline">2D 뷰</span>
        </Link>

        {/* 전시 모드 토글 */}
        <button
          onClick={toggleExhibition}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            isExhibitionMode
              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
              : 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Maximize className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">전시 모드</span>
        </button>

        {/* 바이브 코딩 매뉴얼 링크 */}
        <a
          href="/manual.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:from-blue-500 hover:to-indigo-500 transition-all"
        >
          <BookOpen className="w-4 h-4" />
          <span>매뉴얼</span>
        </a>
      </div>

      {/* Pico IP 입력 모달 */}
      {showIpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              Pico 2 W 하드웨어 연결 설정
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Pico 2 W가 접속한 Wi-Fi IP 주소를 입력하세요. (CircuitPython 내장 HTTP 서버)
            </p>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pico 2 W IP 주소
              </label>
              <input
                type="text"
                value={tempIp}
                onChange={(e) => setTempIp(e.target.value)}
                placeholder="예: 192.168.1.105"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowIpModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                닫기
              </button>
              <button
                onClick={handleSaveIp}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
              >
                연결 적용
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
