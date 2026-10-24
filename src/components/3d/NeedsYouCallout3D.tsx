'use client';

import React from 'react';
import { Html } from '@react-three/drei';

interface NeedsYouCallout3DProps {
  onApprove: () => void;
  onReview?: () => void;
  approvalStatus: 'pending' | 'approved';
}

export function NeedsYouCallout3D({
  onApprove,
  onReview,
  approvalStatus,
}: NeedsYouCallout3DProps) {
  if (approvalStatus === 'approved') {
    return (
      <Html position={[0.2, 1.85, 0.2]} center distanceFactor={7}>
        <div className="bg-white rounded-2xl px-4 py-2 border-2 border-emerald-500 shadow-xl pointer-events-auto flex items-center gap-2 select-none whitespace-nowrap shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
            ✅ 승인 완료! 스마트 도어 90° 개방 실행됨
          </span>
        </div>
      </Html>
    );
  }

  return (
    <Html position={[0.1, 1.95, 0.1]} center distanceFactor={7}>
      <div className="relative select-none pointer-events-auto filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
        {/* 말풍선 본체 카드 */}
        <div className="w-[285px] bg-white rounded-2xl p-3.5 border-2 border-slate-900 flex flex-col gap-2.5 relative z-10">
          {/* 상단 뱃지 & 타임라인 */}
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-slate-950 text-white font-black text-[9px] tracking-wide">
              승인 필요
            </span>
            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              스마트 환기 제어
            </span>
            <span className="text-[10px] text-slate-400 font-medium ml-auto">
              2분 58초 남음
            </span>
          </div>

          {/* 본문 텍스트 */}
          <p className="text-[11px] text-slate-800 font-semibold leading-relaxed">
            실내 온도 28.4℃ 감지. 쾌적한 실내 환경을 위해 스마트 도어를 90°로 개방할까요?
          </p>

          {/* 하단 액션 버튼 */}
          <div className="flex items-center justify-end gap-2 pt-0.5">
            <button
              onClick={onReview}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
            >
              상태 검토
            </button>
            <button
              onClick={onApprove}
              className="px-3.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-bold transition-colors border border-blue-200"
            >
              동작 승인
            </button>
          </div>
        </div>

        {/* 말풍선 꼬리침 (Clean SVG pointer tail pointing down) */}
        <div className="absolute left-12 -bottom-2.5 z-20 pointer-events-none">
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
            <path
              d="M0 0L11 11L22 0H0Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2"
            />
            {/* 윗단 경계선 덮개 */}
            <rect x="1" y="0" width="20" height="2" fill="#FFFFFF" />
          </svg>
        </div>
      </div>
    </Html>
  );
}
