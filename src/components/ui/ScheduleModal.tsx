'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, Check, Plus } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AutomationRule {
  id: string;
  title: string;
  trigger: string;
  action: string;
  isActive: boolean;
}

export function ScheduleModal({ isOpen, onClose }: ScheduleModalProps) {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 'rule-1',
      title: '고온 감지 자동 환기',
      trigger: '실내 온도 28.0℃ 이상 감지 시',
      action: '스마트 도어 90° 개방 및 사용자 확인 요청',
      isActive: true,
    },
    {
      id: 'rule-2',
      title: '일몰 및 야간 자동 조명',
      trigger: '주변 조도 20,000 ADC 이하 감지 시',
      action: '실내 무드등 오션 블루 색상 ON',
      isActive: true,
    },
    {
      id: 'rule-3',
      title: '고습도 환경 환기 규칙',
      trigger: '실내 습도 70% 초과 시',
      action: '스마트 도어 45° 미세 환풍 개방',
      isActive: true,
    },
    {
      id: 'rule-4',
      title: '취침 모드 스케줄',
      trigger: '매일 밤 23:00 정각',
      action: '실내 무드등 로맨틱 퍼플 은은한 조명 전환',
      isActive: true,
    },
    {
      id: 'rule-5',
      title: '보안 잠금 스케줄',
      trigger: '매일 자정 24:00 정각',
      action: '전체 조명 OFF 및 스마트 도어 0° 완전 잠금',
      isActive: true,
    },
  ]);

  if (!isOpen) return null;

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs select-none p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                스마트 공간 자동화 스케줄 & 규칙
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                센서 조건부 트리거(Event-Driven) 및 예약 실행 규칙
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

        {/* 규칙 리스트 */}
        <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                rule.isActive
                  ? 'bg-white border-slate-200/90 shadow-2xs'
                  : 'bg-slate-50 border-slate-200/50 opacity-60'
              }`}
            >
              <div className="flex flex-col min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {rule.title}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      rule.isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {rule.isActive ? '실행 중' : '비활성'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  <strong>조건:</strong> {rule.trigger}
                </span>
                <span className="text-[11px] text-blue-600 font-medium">
                  <strong>동작:</strong> {rule.action}
                </span>
              </div>

              {/* 토글 스위치 */}
              <button
                onClick={() => toggleRule(rule.id)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                  rule.isActive ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    rule.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* 팁 안내 */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 leading-relaxed">
          ⚡ <strong>규칙 추가 팁:</strong> 센서 조건에 따른 자동 제어 로직은 프론트엔드에서는 <code>useIoTStore.ts</code>의 구독(subscribe) 핸들러에서, 하드웨어에서는 <code>code.py</code>의 메인 루프에서 if 조건문으로 직접 추가할 수 있습니다.
        </div>

        {/* 하단 닫기 */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
