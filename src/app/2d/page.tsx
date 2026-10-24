'use client';

import React from 'react';
import Link from 'next/link';
import { useIoTStore } from '@/core/store/useIoTStore';
import {
  Box,
  Thermometer,
  Droplets,
  Sun,
  DoorOpen,
  DoorClosed,
  Lightbulb,
  Sliders,
  Activity,
  Cpu,
  Clock,
  ArrowLeft,
  Terminal,
} from 'lucide-react';

export default function Classic2DDashboardPage() {
  const mode = useIoTStore((s) => s.mode);
  const setMode = useIoTStore((s) => s.setMode);
  const connectionState = useIoTStore((s) => s.connectionState);
  const picoIpAddress = useIoTStore((s) => s.picoIpAddress);
  const sensors = useIoTStore((s) => s.sensors);
  const actuators = useIoTStore((s) => s.actuators);
  const logs = useIoTStore((s) => s.logs);

  const setServoAngle = useIoTStore((s) => s.setServoAngle);
  const setRgbColor = useIoTStore((s) => s.setRgbColor);
  const setRgbState = useIoTStore((s) => s.setRgbState);

  const door = actuators.sg90_door;
  const light = actuators.rgb_light;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col gap-6 overflow-y-auto">
      {/* 1. 상단 내비게이션 */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            3D 뷰로 복귀
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              클래식 2D IoT 모니터링 & 제어 대시보드
            </h1>
            <p className="text-xs text-slate-400">
              스마트홈 공통 플랫폼 레퍼런스 (동일 상태 공유)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 모드 전환 */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setMode('simulation')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                mode === 'simulation'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              시뮬레이션
            </button>
            <button
              onClick={() => setMode('hardware')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                mode === 'hardware'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Pico 2 W
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionState === 'connected' ? 'bg-emerald-400' : 'bg-rose-500'
              }`}
            />
            <span className="text-slate-300 font-medium">
              {mode === 'simulation' ? '시뮬레이터' : `Pico 2 W (${picoIpAddress})`}
            </span>
          </div>
        </div>
      </header>

      {/* 2. 센서 모니터링 카드 그리드 */}
      <section>
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          환경 센서 실시간 모니터링 (Readings)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* DHT11 온도 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">실내 온도</span>
              <Thermometer className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-rose-400 tracking-tight">
                  {sensors.dht11_temp.value.toFixed(1)}
                </span>
                <span className="text-lg text-slate-400">℃</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-800/80">
                <span>센서: DHT11 (GP15)</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(sensors.dht11_temp.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* DHT11 습도 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">실내 습도</span>
              <Droplets className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-sky-400 tracking-tight">
                  {sensors.dht11_humi.value.toFixed(1)}
                </span>
                <span className="text-lg text-slate-400">%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-800/80">
                <span>센서: DHT11 (GP15)</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(sensors.dht11_humi.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Cds 조도 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">조도 센서</span>
              <Sun className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-amber-400 tracking-tight">
                  {Math.round((sensors.cds_light.value / 65535) * 100)}
                </span>
                <span className="text-lg text-slate-400">%</span>
                <span className="text-xs text-slate-500 ml-2">
                  ({sensors.cds_light.value} ADC)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-800/80">
                <span>센서: Cds (GP26 / A0)</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(sensors.cds_light.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 액추에이터 제어 카드 그리드 */}
      <section>
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          장치 제어 (Actuators Control)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SG90 서보모터 스마트 도어 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DoorClosed className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold text-slate-200">
                  스마트 도어 서보모터 (SG90)
                </span>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                현재 각도: {door.reportedAngle}°
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              GP16 핀 (50Hz PWM)으로 서보모터 각도를 제어하여 가상 도어 및 실제 도어를 개폐합니다.
            </p>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>닫힘 (0°)</span>
                <span className="font-bold text-slate-200">{door.targetAngle}°</span>
                <span>열림 (180°)</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={door.targetAngle}
                disabled={door.pending}
                onChange={(e) => setServoAngle(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setServoAngle(0)}
                disabled={door.pending}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <DoorClosed className="w-4 h-4" /> 도어 닫기 (0°)
              </button>
              <button
                onClick={() => setServoAngle(90)}
                disabled={door.pending}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow flex items-center justify-center gap-1.5 transition-colors"
              >
                <DoorOpen className="w-4 h-4" /> 도어 열기 (90°)
              </button>
            </div>
          </div>

          {/* RGB LED 스마트 조명 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb
                  className="w-5 h-5 transition-colors"
                  style={{
                    color: light.reportedState === 'ON' ? light.reportedColor : '#64748B',
                  }}
                />
                <span className="text-sm font-bold text-slate-200">
                  실내 무드등 (RGB LED)
                </span>
              </div>
              <button
                onClick={() => setRgbState(light.reportedState === 'ON' ? 'OFF' : 'ON')}
                disabled={light.pending}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  light.reportedState === 'ON'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                전원: {light.reportedState}
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              GP18(R), GP19(G), GP20(B) PWM 출력으로 컬러 믹싱 및 밝기를 제어합니다.
            </p>

            <div className="flex items-center gap-3 mb-4">
              <input
                type="color"
                value={light.targetColor}
                disabled={light.pending}
                onChange={(e) => {
                  setRgbColor(e.target.value);
                  if (light.reportedState === 'OFF') setRgbState('ON');
                }}
                className="w-10 h-10 rounded-xl bg-transparent cursor-pointer p-0 border-0"
              />
              <span className="font-mono text-xs font-bold text-slate-300">
                색상 코드: {light.reportedColor}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 시스템 로그 */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          통신 및 제어 이벤트 로그
        </h2>
        <div className="max-h-60 overflow-y-auto font-mono text-xs flex flex-col gap-1.5">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center gap-2 text-slate-400">
              <span className="text-slate-600">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className="text-blue-400 font-bold">[{log.source}]</span>
              <span className="text-slate-200">{log.message}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
