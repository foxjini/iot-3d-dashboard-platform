'use client';

import React from 'react';
import { X, SlidersHorizontal, Cpu, Plus, CheckCircle2 } from 'lucide-react';
import { useIoTStore } from '@/core/store/useIoTStore';

interface DeviceManageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeviceManageModal({ isOpen, onClose }: DeviceManageModalProps) {
  const mode = useIoTStore((s) => s.mode);
  const picoIp = useIoTStore((s) => s.picoIpAddress);

  if (!isOpen) return null;

  const devices = [
    {
      id: 'dht11',
      name: '온습도 센서 (DHT11)',
      pin: 'GP15',
      type: '디지털 단선 버스',
      role: '실내 온도 및 습도 2초 주기 샘플링',
      status: '정상 가동',
    },
    {
      id: 'cds',
      name: '조도 센서 (Cds)',
      pin: 'GP26 (ADC0)',
      type: '16비트 아날로그 전압',
      role: '주변 밝기 측정 및 3D 앰비언트 광 연동',
      status: '정상 가동',
    },
    {
      id: 'sg90',
      name: '스마트 도어 서보 (SG90)',
      pin: 'GP16',
      type: '50Hz PWM (0~180°)',
      role: '스마트 도어 개폐 각도 물리적 제어',
      status: '정상 가동',
    },
    {
      id: 'rgb_led',
      name: '실내 무드등 (RGB LED)',
      pin: 'GP18, GP19, GP20',
      type: '3채널 PWM 출력',
      role: '실내 조명 색상 및 밝기 물리적 발광',
      status: '정상 가동',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs select-none p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                연결된 IoT 하드웨어 장치 관리
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Pico 2 W ({mode === 'simulation' ? '시뮬레이션 가동' : picoIp}) 핀맵 및 프로토콜 현황
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

        {/* 장치 목록 테이블 */}
        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
          {devices.map((dev) => (
            <div
              key={dev.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{dev.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                    {dev.pin}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  {dev.type} · {dev.role}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-600">{dev.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 팁 안내 */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-xs text-slate-600 leading-relaxed">
          💡 <strong>팀 프로젝트 팁:</strong> 초음파 센서(HC-SR04), 토양 수분 센서, 서보모터 등 새로운 하드웨어를 추가하려면 <code>context/CONTEXT_CIRCUITPYTHON_MAP.md</code>의 핀맵과 <code>src/core/types/iot.ts</code>에 장치를 등록하면 됩니다.
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
