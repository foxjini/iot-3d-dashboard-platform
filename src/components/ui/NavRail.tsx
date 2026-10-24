'use client';

import React from 'react';
import Link from 'next/link';
import { useIoTStore } from '@/core/store/useIoTStore';
import {
  LayoutGrid,
  Clock,
  Sliders,
  Wifi,
  BookOpen,
  Maximize,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface NavRailProps {
  onOpenIpModal: () => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
}

export function NavRail({ onOpenIpModal, activeNavTab, setActiveNavTab }: NavRailProps) {
  const isAutoRotate = useIoTStore((s) => s.isAutoRotate);
  const setAutoRotate = useIoTStore((s) => s.setAutoRotate);
  const isExhibitionMode = useIoTStore((s) => s.isExhibitionMode);
  const setExhibitionMode = useIoTStore((s) => s.setExhibitionMode);
  const connectionState = useIoTStore((s) => s.connectionState);
  const mode = useIoTStore((s) => s.mode);

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

  return (
    <aside className="w-[68px] h-full flex flex-col items-center py-4 px-2.5 bg-[#F6F8FB] border-r border-slate-200/80 justify-between shrink-0 select-none z-20">
      {/* 1. 상단 로고 & 메인 내비게이션 */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Nomadian 스타일 텐트/캠프파이어 & IoT 엠블럼 */}
        <div
          className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-600 p-0.5 shadow-md shadow-orange-500/20 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center group"
          title="스마트홈 3D IoT 플랫폼"
        >
          <div className="w-full h-full bg-white/95 rounded-[14px] flex items-center justify-center overflow-hidden relative">
            {/* 캠프파이어 & 텐트 미니 SVG */}
            <svg
              viewBox="0 0 32 32"
              className="w-7 h-7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 뒷 배경 솔숲 */}
              <path
                d="M10 16L13 11L16 16H10Z"
                fill="#10B981"
                opacity="0.9"
              />
              <path
                d="M20 17L22 13L24 17H20Z"
                fill="#059669"
                opacity="0.8"
              />
              {/* 오렌지색 캠핑 텐트 */}
              <path
                d="M8 24L16 8L24 24H8Z"
                fill="url(#tent_grad)"
              />
              <path
                d="M16 8L24 24H18L16 13L14 24H8L16 8Z"
                fill="#EA580C"
                opacity="0.25"
              />
              {/* 텐트 입구 그늘 */}
              <path
                d="M14 24L16 17L18 24H14Z"
                fill="#431407"
                opacity="0.7"
              />
              {/* 미니 스마트 비콘 점 */}
              <circle cx="16" cy="6" r="2" fill="#F59E0B" />
              <defs>
                <linearGradient
                  id="tent_grad"
                  x1="8"
                  y1="8"
                  x2="24"
                  y2="24"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FB923C" />
                  <stop offset="1" stopColor="#EA580C" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* 메인 메뉴 아이콘 버튼 리스트 */}
        <nav className="flex flex-col items-center gap-2.5 w-full mt-2">
          {/* 3D 가상 공간 (Active) */}
          <button
            onClick={() => setActiveNavTab('space')}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              activeNavTab === 'space'
                ? 'bg-[#185ADB] text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-500/20'
                : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200/70 shadow-sm'
            }`}
            title="3D 가상 공간 뷰"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          {/* 센서 로그 및 텔레메트리 히스토리 */}
          <button
            onClick={() => setActiveNavTab('telemetry')}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              activeNavTab === 'telemetry'
                ? 'bg-[#185ADB] text-white shadow-lg shadow-blue-600/30'
                : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200/70 shadow-sm'
            }`}
            title="실시간 텔레메트리 & 로그"
          >
            <Clock className="w-5 h-5" />
          </button>

          {/* 장치 액추에이터 제어 */}
          <button
            onClick={() => setActiveNavTab('control')}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              activeNavTab === 'control'
                ? 'bg-[#185ADB] text-white shadow-lg shadow-blue-600/30'
                : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200/70 shadow-sm'
            }`}
            title="하드웨어 제어 컨트롤러"
          >
            <Sliders className="w-5 h-5" />
          </button>

          {/* 하드웨어 Pico 2 W 연결 모달 */}
          <button
            onClick={onOpenIpModal}
            className={`relative w-11 h-11 rounded-2xl flex items-center justify-center bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200/70 shadow-sm transition-all`}
            title={`Pico 2 W 하드웨어 연결 설정 (${mode === 'simulation' ? '시뮬레이션' : '하드웨어'})`}
          >
            <Wifi className="w-5 h-5" />
            <span
              className={`absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-white ${
                connectionState === 'connected'
                  ? 'bg-emerald-500'
                  : connectionState === 'connecting'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-rose-500'
              }`}
            />
          </button>

          {/* 바이브 코딩 실전 매뉴얼 */}
          <Link
            href="/manual.html"
            target="_blank"
            className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white text-slate-500 hover:text-blue-600 hover:bg-slate-50 border border-slate-200/70 shadow-sm transition-all"
            title="바이브 코딩 가이드 매뉴얼"
          >
            <BookOpen className="w-5 h-5" />
          </Link>
        </nav>
      </div>

      {/* 2. 하단 유틸리티 툴바 */}
      <div className="flex flex-col items-center gap-2.5 w-full">
        {/* 3D 자동 회전 (Auto-Rotate) 토글 */}
        <button
          onClick={() => setAutoRotate(!isAutoRotate)}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all border ${
            isAutoRotate
              ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
              : 'bg-white text-slate-400 hover:text-slate-700 border-slate-200/70 shadow-sm'
          }`}
          title={isAutoRotate ? '3D 자동 회전 정지' : '3D 자동 회전 시작'}
        >
          <RotateCcw
            className={`w-4 h-4 ${isAutoRotate ? 'animate-spin' : ''}`}
            style={{ animationDuration: '6s' }}
          />
        </button>

        {/* 전시 모드 (전체화면 / 화면꺼짐방지) */}
        <button
          onClick={toggleExhibition}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all border ${
            isExhibitionMode
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
              : 'bg-white text-slate-400 hover:text-slate-700 border-slate-200/70 shadow-sm'
          }`}
          title="부스 전시 모드 (전체화면 & 화면 켜짐 유지)"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
