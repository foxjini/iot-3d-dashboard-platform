'use client';

import React from 'react';
import { useIoTStore } from '@/core/store/useIoTStore';
import {
  DoorClosed,
  DoorOpen,
  Lightbulb,
  Thermometer,
  Droplets,
  Sun,
  Loader2,
  Sliders,
  Check,
  ChevronRight,
} from 'lucide-react';

const PRESET_COLORS = [
  { name: '오션 블루', color: '#3B82F6' },
  { name: '웜 화이트', color: '#FDE047' },
  { name: '네온 에메랄드', color: '#10B981' },
  { name: '로맨틱 퍼플', color: '#A855F7' },
  { name: '선셋 레드', color: '#EF4444' },
];

export function ControlDrawer() {
  const sensors = useIoTStore((s) => s.sensors);
  const actuators = useIoTStore((s) => s.actuators);
  const selectedDeviceId = useIoTStore((s) => s.selectedDeviceId);
  const setSelectedDevice = useIoTStore((s) => s.setSelectedDevice);

  const setServoAngle = useIoTStore((s) => s.setServoAngle);
  const setRgbColor = useIoTStore((s) => s.setRgbColor);
  const setRgbState = useIoTStore((s) => s.setRgbState);

  const door = actuators.sg90_door;
  const light = actuators.rgb_light;

  return (
    <aside className="absolute right-4 top-20 bottom-24 w-80 z-10 pointer-events-none flex flex-col gap-3">
      {/* 1. 액추에이터 제어 카드 (SG90 서보 & RGB LED) */}
      <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-700/60 p-4 shadow-2xl pointer-events-auto flex flex-col gap-4 overflow-y-auto max-h-[60%]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            장치 제어 (Actuators)
          </h2>
          <span className="text-[10px] text-slate-400">2-Phase 제어</span>
        </div>

        {/* SG90 서보모터 스마트 도어 */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            selectedDeviceId === 'sg90_door'
              ? 'bg-blue-950/40 border-blue-500/60 ring-1 ring-blue-500/40'
              : 'bg-slate-800/40 border-slate-700/40'
          }`}
          onClick={() => setSelectedDevice('sg90_door')}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DoorClosed className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">
                스마트 도어 (SG90)
              </span>
            </div>
            {door.pending ? (
              <span className="flex items-center gap-1 text-[10px] text-blue-400 animate-pulse font-medium">
                <Loader2 className="w-3 h-3 animate-spin" /> 동작 중
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-300">
                {door.reportedAngle}°
              </span>
            )}
          </div>

          {/* 서보 각도 슬라이더 */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={door.targetAngle}
              disabled={door.pending}
              onChange={(e) => setServoAngle(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer disabled:opacity-50"
            />
          </div>

          {/* 원클릭 버튼 */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setServoAngle(0);
              }}
              disabled={door.pending}
              className={`py-1 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-1 ${
                door.reportedAngle === 0
                  ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                  : 'border-slate-700 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <DoorClosed className="w-3.5 h-3.5" /> 닫기 (0°)
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setServoAngle(90);
              }}
              disabled={door.pending}
              className={`py-1 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-1 ${
                door.reportedAngle === 90
                  ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                  : 'border-slate-700 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <DoorOpen className="w-3.5 h-3.5" /> 열기 (90°)
            </button>
          </div>
        </div>

        {/* RGB LED 스마트 조명 */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            selectedDeviceId === 'rgb_light'
              ? 'bg-blue-950/40 border-blue-500/60 ring-1 ring-blue-500/40'
              : 'bg-slate-800/40 border-slate-700/40'
          }`}
          onClick={() => setSelectedDevice('rgb_light')}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Lightbulb
                className="w-4 h-4 transition-colors"
                style={{
                  color: light.reportedState === 'ON' ? light.reportedColor : '#64748B',
                }}
              />
              <span className="text-xs font-semibold text-slate-200">
                실내 무드등 (RGB LED)
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRgbState(light.reportedState === 'ON' ? 'OFF' : 'ON');
              }}
              disabled={light.pending}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                light.reportedState === 'ON'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {light.reportedState}
            </button>
          </div>

          {/* 프리셋 컬러 팔레트 */}
          <div className="flex items-center justify-between gap-1 mt-2">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset.color}
                onClick={(e) => {
                  e.stopPropagation();
                  setRgbColor(preset.color);
                  if (light.reportedState === 'OFF') setRgbState('ON');
                }}
                disabled={light.pending}
                className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center"
                style={{
                  backgroundColor: preset.color,
                  borderColor:
                    light.reportedColor === preset.color ? '#FFFFFF' : 'transparent',
                }}
                title={preset.name}
              >
                {light.reportedColor === preset.color && (
                  <Check className="w-3 h-3 text-white drop-shadow" />
                )}
              </button>
            ))}
            <input
              type="color"
              value={light.targetColor}
              disabled={light.pending}
              onChange={(e) => {
                setRgbColor(e.target.value);
                if (light.reportedState === 'OFF') setRgbState('ON');
              }}
              className="w-6 h-6 rounded-full bg-transparent cursor-pointer p-0 border-0"
              title="직접 색상 선택"
            />
          </div>
        </div>
      </div>

      {/* 2. 센서 실시간 모니터링 카드 */}
      <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-700/60 p-4 shadow-2xl pointer-events-auto flex flex-col gap-2.5">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-0.5">
          실시간 환경 센서
        </h3>

        {/* DHT11 온도 */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <Thermometer className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block leading-none">
                실내 온도
              </span>
              <span className="text-xs font-bold text-slate-200">DHT11</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-rose-400">
              {sensors.dht11_temp.value.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 ml-0.5">℃</span>
          </div>
        </div>

        {/* DHT11 습도 */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block leading-none">
                실내 습도
              </span>
              <span className="text-xs font-bold text-slate-200">DHT11</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-sky-400">
              {sensors.dht11_humi.value.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 ml-0.5">%</span>
          </div>
        </div>

        {/* Cds 조도 */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block leading-none">
                주변 밝기
              </span>
              <span className="text-xs font-bold text-slate-200">Cds 광센서</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-amber-300">
              {Math.round((sensors.cds_light.value / 65535) * 100)}
            </span>
            <span className="text-xs text-slate-400 ml-0.5">%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
