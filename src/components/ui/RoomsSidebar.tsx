'use client';

import React from 'react';
import {
  ChevronLeft,
  Coffee,
  Clock,
  Plus,
  MoreVertical,
  Home,
  Sprout,
  Factory,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export interface RoomItem {
  id: string;
  name: string;
  sensorsDesc: string;
  iconType: 'home' | 'farm' | 'factory' | 'sparkles' | 'shield';
  iconBg: string;
  iconColor: string;
  hasNotification?: boolean;
}

interface RoomsSidebarProps {
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
  onOpenAddRoomModal: () => void;
  onOpenScheduleModal: () => void;
  roomList: RoomItem[];
}

export function RoomsSidebar({
  activeRoomId,
  onSelectRoom,
  onOpenAddRoomModal,
  onOpenScheduleModal,
  roomList,
}: RoomsSidebarProps) {
  return (
    <aside className="w-[280px] h-full flex flex-col bg-[#F8FAFC] border-r border-slate-200/80 p-4 gap-3.5 shrink-0 overflow-y-auto select-none">
      {/* 1. 상단 타이틀 */}
      <div className="flex items-center gap-2 pt-1 pb-0.5">
        <button
          className="w-7 h-7 rounded-lg bg-white border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 flex items-center justify-center transition-all shadow-2xs"
          title="이전으로"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
          스마트 공간 목록
        </h2>
      </div>

      {/* 2. 상단 퀵 카드 2종 (메인 허브 & 자동화 스케줄) */}
      <div className="flex flex-col gap-2.5">
        {/* 거실 메인 라운지 카드 */}
        <div
          onClick={() => onSelectRoom('marketing')}
          className="group p-3 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-amber-700 shrink-0">
            <Coffee className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-900 truncate">
              메인 라운지 (거실)
            </span>
            <span className="text-[11px] text-slate-400 font-medium truncate">
              4개 장치 연결 · 3개 센서 정상
            </span>
          </div>
        </div>

        {/* 자동화 스케줄 카드 (클릭 시 스케줄 모달 오픈) */}
        <div
          onClick={onOpenScheduleModal}
          className="group p-3 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-900 truncate">
              자동화 스케줄
            </span>
            <span className="text-[11px] text-slate-400 font-medium truncate">
              5개 규칙 실행 중 · 총 6개 등록
            </span>
          </div>
        </div>
      </div>

      {/* 3. 공간 목록 섹션 헤더 & 카운터 */}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 tracking-wider pt-2">
        <span>공간 목록</span>
        <span>{roomList.length}개 구역</span>
      </div>

      {/* 4. + 새 공간 추가 점선 버튼 */}
      <button
        onClick={onOpenAddRoomModal}
        className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300/90 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-white transition-all flex items-center justify-center gap-1.5 shadow-2xs"
      >
        <Plus className="w-3.5 h-3.5 text-slate-500" />
        <span>새 공간 추가</span>
      </button>

      {/* 5. 공간 리스트 아이템들 */}
      <div className="flex flex-col gap-2">
        {roomList.map((room) => {
          const isSelected = activeRoomId === room.id;
          return (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`group relative p-2.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between border ${
                isSelected
                  ? 'bg-white border-blue-300/80 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-blue-500/20'
                  : 'bg-white/80 hover:bg-white border-slate-200/70 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* 룸 아이콘 */}
                <div
                  className={`relative w-8 h-8 rounded-xl ${room.iconBg} ${room.iconColor} flex items-center justify-center shrink-0`}
                >
                  {room.iconType === 'home' && <Home className="w-4 h-4" />}
                  {room.iconType === 'farm' && <Sprout className="w-4 h-4" />}
                  {room.iconType === 'factory' && <Factory className="w-4 h-4" />}
                  {room.iconType === 'sparkles' && <Sparkles className="w-4 h-4" />}
                  {room.iconType === 'shield' && <ShieldCheck className="w-4 h-4" />}

                  {/* 빨간 알림 뱃지 점 */}
                  {room.hasNotification && (
                    <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                  )}
                </div>

                {/* 룸 정보 */}
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-xs font-bold truncate ${
                      isSelected ? 'text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {room.name}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium truncate">
                    {room.sensorsDesc}
                  </span>
                </div>
              </div>

              {/* 우측 더보기 메뉴 (세 점) */}
              <button
                onClick={(e) => e.stopPropagation()}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                title="상세 메뉴"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
