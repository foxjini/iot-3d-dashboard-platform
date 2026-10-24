'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Radio, Settings } from 'lucide-react';
import { useIoTStore } from '@/core/store/useIoTStore';

interface CenterHeaderProps {
  roomName: string;
  activeTab: 'inspector' | 'output' | 'thread';
  onTabChange: (tab: 'inspector' | 'output' | 'thread') => void;
  onOpenIpModal: () => void;
}

export function CenterHeader({
  roomName,
  activeTab,
  onTabChange,
  onOpenIpModal,
}: CenterHeaderProps) {
  const mode = useIoTStore((s) => s.mode);
  const setMode = useIoTStore((s) => s.setMode);
  const connectionState = useIoTStore((s) => s.connectionState);
  const picoIpAddress = useIoTStore((s) => s.picoIpAddress);

  const [timeString, setTimeString] = useState('14 : 30');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeString(`${hours} : ${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 px-6 flex items-center justify-between select-none z-10 shrink-0 border-b border-slate-200/50 bg-[#F6F8FB]/60 backdrop-blur-xs">
      {/* 1. 좌측 룸 타이틀 & 서브타이틀 & 실시간 상태 */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-[19px] font-extrabold text-slate-900 tracking-tight leading-none">
            {roomName}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            연결 장치 4개 · 텔레메트리 6개 실시간 수집 중
          </p>
        </div>

        {/* 실시간 모니터링 인디케이터 (● 실시간 14 : 30) */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-slate-200/70 shadow-2xs whitespace-nowrap shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[11px] font-bold text-emerald-600 tracking-tight whitespace-nowrap">
            실시간
          </span>
          <span className="text-[11px] font-mono font-medium text-slate-500 whitespace-nowrap">
            {timeString}
          </span>
        </div>
      </div>

      {/* 2. 우측 모드 전환 & 인스펙터/출력/로그 세그먼트 탭 */}
      <div className="flex items-center gap-3">
        {/* 하드웨어 / 시뮬레이션 모드 전환 알약 스위치 */}
        <div className="flex items-center bg-white/90 p-1 rounded-full border border-slate-200/80 shadow-2xs">
          <button
            onClick={() => setMode('simulation')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              mode === 'simulation'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            시뮬레이션
          </button>
          <button
            onClick={() => setMode('hardware')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'hardware'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>Pico 2 W</span>
          </button>
          <button
            onClick={onOpenIpModal}
            className="p-1 text-slate-400 hover:text-slate-700 ml-0.5 rounded-full hover:bg-slate-100 transition-colors"
            title="IP 설정"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Segmented Tab Pill: [ 장치 인스펙터 ] 센서 출력 제어 로그 > */}
        <div className="flex items-center bg-white/90 p-1 rounded-full border border-slate-200/80 shadow-2xs whitespace-nowrap shrink-0">
          <button
            onClick={() => onTabChange('inspector')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'inspector'
                ? 'bg-[#18181B] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            장치 인스펙터
          </button>

          <button
            onClick={() => onTabChange('output')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'output'
                ? 'bg-[#18181B] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            센서 출력
          </button>

          <button
            onClick={() => onTabChange('thread')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'thread'
                ? 'bg-[#18181B] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            제어 로그
          </button>

          <button
            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-0.5 shrink-0"
            title="상세 탭 펼치기"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
