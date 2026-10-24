'use client';

import React, { useState } from 'react';
import { X, Plus, Home, Sprout, Factory, Sparkles, ShieldCheck } from 'lucide-react';
import { RoomItem } from './RoomsSidebar';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (room: RoomItem) => void;
}

export function AddRoomModal({ isOpen, onClose, onAddRoom }: AddRoomModalProps) {
  const [name, setName] = useState('');
  const [sensorsDesc, setSensorsDesc] = useState('');
  const [iconType, setIconType] = useState<RoomItem['iconType']>('home');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const colors: Record<RoomItem['iconType'], { bg: string; color: string }> = {
      home: { bg: 'bg-amber-100', color: 'text-amber-700' },
      farm: { bg: 'bg-emerald-100', color: 'text-emerald-700' },
      factory: { bg: 'bg-blue-100', color: 'text-blue-700' },
      sparkles: { bg: 'bg-purple-100', color: 'text-purple-700' },
      shield: { bg: 'bg-rose-100', color: 'text-rose-700' },
    };

    const newRoom: RoomItem = {
      id: `room_${Date.now()}`,
      name: name.trim(),
      sensorsDesc: sensorsDesc.trim() || '신규 모니터링 센서 노드',
      iconType,
      iconBg: colors[iconType].bg,
      iconColor: colors[iconType].color,
    };

    onAddRoom(newRoom);
    setName('');
    setSensorsDesc('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-xs select-none p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                새 모니터링 공간 추가
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                프로젝트 주제에 맞춘 커스텀 공간을 사이드바에 등록합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">공간 및 구역 명칭</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 스마트 펫룸, 베란다 수경재배 온실"
              required
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">배치 센서 및 장치 설명</label>
            <input
              type="text"
              value={sensorsDesc}
              onChange={(e) => setSensorsDesc(e.target.value)}
              placeholder="예: 온습도 센서 · 급식기 서보모터"
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">대표 아이콘 선택</label>
            <div className="flex items-center gap-2">
              {[
                { type: 'home' as const, label: '거실/홈', icon: Home },
                { type: 'farm' as const, label: '팜/온실', icon: Sprout },
                { type: 'factory' as const, label: '공장', icon: Factory },
                { type: 'sparkles' as const, label: '조명', icon: Sparkles },
                { type: 'shield' as const, label: '보안', icon: ShieldCheck },
              ].map(({ type, label, icon: IconComponent }) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setIconType(type)}
                  className={`flex-1 py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    iconType === type
                      ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-2xs font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-[10px]">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
            >
              공간 생성 및 추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
