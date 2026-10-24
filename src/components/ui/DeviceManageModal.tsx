'use client';

import React, { useState } from 'react';
import {
  X,
  SlidersHorizontal,
  Cpu,
  Sparkles,
  Copy,
  Check,
  FileCode,
  ArrowRight,
  CheckCircle2,
  Sprout,
  Factory,
  Trash2,
  ShieldAlert,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useIoTStore } from '@/core/store/useIoTStore';

interface DeviceManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedbackMessage?: (msg: string) => void;
}

interface PresetItem {
  id: string;
  name: string;
  icon: any;
  badge: string;
  badgeColor: string;
  sensorName: string;
  sensorPin: string;
  sensorUnit: string;
  actuatorName: string;
  actuatorPin: string;
  actuatorRole: string;
  description: string;
}

const PRESETS: PresetItem[] = [
  {
    id: 'farm',
    name: '스마트 팜 온실',
    icon: Sprout,
    badge: '추천 1위',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    sensorName: '토양 수분 센서 (Soil Moisture)',
    sensorPin: 'GP27 (ADC1)',
    sensorUnit: '%',
    actuatorName: '자동 관수 워터 펌프 (Water Pump)',
    actuatorPin: 'GP21 (PWM/Relay)',
    actuatorRole: '토양 수분 35% 미만 시 5초간 펌프 가동 (급수 시작)',
    description: '화분 토양 수분 자동 측정 및 스프링클러/워터펌프 연동',
  },
  {
    id: 'factory',
    name: '스마트 팩토리 공정',
    icon: Factory,
    badge: '제조/물류',
    badgeColor: 'bg-blue-100 text-blue-700',
    sensorName: '초음파 거리 센서 (HC-SR04)',
    sensorPin: 'GP17 (Echo) / GP27 (Trig)',
    sensorUnit: 'cm',
    actuatorName: '컨베이어 분류 서보모터 (SG90)',
    actuatorPin: 'GP22 (PWM)',
    actuatorRole: '제품 감지(거리 < 8cm) 시 불량품 배출 게이트 90° 회전',
    description: '생산 라인 물품 감지 및 불량품 선별 자동화',
  },
  {
    id: 'trash',
    name: '스마트 분리수거/도어',
    icon: Trash2,
    badge: '생활/위생',
    badgeColor: 'bg-amber-100 text-amber-700',
    sensorName: 'PIR 인체 감지 센서',
    sensorPin: 'GP28 (Digital In)',
    sensorUnit: '감지(0/1)',
    actuatorName: '자동 뚜껑 개폐 서보모터',
    actuatorPin: 'GP16 (PWM)',
    actuatorRole: '손 접근 감지 시 쓰레기통 뚜껑 90° 개방 및 3초 후 닫힘',
    description: '비접촉 위생 분리수거함 및 자동 도어락',
  },
  {
    id: 'gas',
    name: '스마트 안전/환경 허브',
    icon: ShieldAlert,
    badge: '방재/안전',
    badgeColor: 'bg-rose-100 text-rose-700',
    sensorName: 'MQ-2 가스 누출 센서',
    sensorPin: 'GP26 (ADC0)',
    sensorUnit: 'ppm',
    actuatorName: '비상 경보 피에조 부저',
    actuatorPin: 'GP14 (PWM)',
    actuatorRole: '가스 누출 감지 시 85dB 비상 사이렌 울림 및 경고등 점멸',
    description: '실내 유해가스 감지 및 비상 피난 경보',
  },
];

export function DeviceManageModal({ isOpen, onClose, onFeedbackMessage }: DeviceManageModalProps) {
  const mode = useIoTStore((s) => s.mode);
  const picoIp = useIoTStore((s) => s.picoIpAddress);
  const addLog = useIoTStore((s) => s.addLog);

  const [activeTab, setActiveTab] = useState<'current' | 'vibe'>('current');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('farm');

  const [projectName, setProjectName] = useState('스마트 팜 온실');
  const [sensorName, setSensorName] = useState('토양 수분 센서 (Soil Moisture)');
  const [sensorPin, setSensorPin] = useState('GP27 (ADC1)');
  const [sensorUnit, setSensorUnit] = useState('%');
  const [actuatorName, setActuatorName] = useState('자동 관수 워터 펌프 (Water Pump)');
  const [actuatorPin, setActuatorPin] = useState('GP21 (PWM/Relay)');
  const [actuatorRole, setActuatorRole] = useState('토양 수분 35% 미만 시 5초간 펌프 가동 (급수 시작)');

  const [isCopied, setIsCopied] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  if (!isOpen) return null;

  const referenceDevices = [
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

  const handleSelectPreset = (p: PresetItem) => {
    setSelectedPresetId(p.id);
    setProjectName(p.name);
    setSensorName(p.sensorName);
    setSensorPin(p.sensorPin);
    setSensorUnit(p.sensorUnit);
    setActuatorName(p.actuatorName);
    setActuatorPin(p.actuatorPin);
    setActuatorRole(p.actuatorRole);
    setIsSimulated(false);
  };

  const generatedPrompt = `[스마트홈 3D IoT 대시보드 하드웨어 핀맵 & 대시보드 변경 요청]
저희 팀의 프로젝트 과제 주제는 "${projectName}"입니다.
기존 레퍼런스 하드웨어 구성을 아래의 신규 장치로 교체/추가해주세요:

1. 신규 센서: ${sensorName}
   - 연결 핀: ${sensorPin}
   - 측정 단위 및 용도: ${sensorUnit} (실시간 텔레메트리 연동)

2. 신규 액추에이터: ${actuatorName}
   - 연결 핀: ${actuatorPin}
   - 동작 기능: ${actuatorRole}

[AI 코딩 지침 (Context Engineering 규칙 준수)]
다음 순서에 따라 코드를 수정하고 연동해주세요:
1. \`context/CONTEXT_CIRCUITPYTHON_MAP.md\` 및 \`firmware/pico2w/code.py\`: 위 핀맵에 맞는 CircuitPython 핀 및 REST 핸들러 추가
2. \`src/core/types/iot.ts\`: 센서/액추에이터 인터페이스에 신규 필드 정의
3. \`src/core/adapter/MockIoTAdapter.ts\`: 시뮬레이션용 데이터 발생기 및 액추에이터 핸들러 추가
4. \`src/components/3d/\`: 3D 가상 공간에 해당 장치 3D 오브젝트 배치
5. \`src/components/ui/InspectorPanel.tsx\` 및 \`SensorOutputPanel.tsx\`: 센서 게이지와 제어 스위치 위젯 추가`;

  const handleCopyPrompt = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedPrompt);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = generatedPrompt;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      if (onFeedbackMessage) {
        onFeedbackMessage('AI 바이브 코딩 맞춤 프롬프트가 클립보드에 복사되었습니다! AI 채팅창에 붙여넣으세요.');
      }
      setTimeout(() => setIsCopied(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateApply = () => {
    setIsSimulated(true);
    addLog(
      'info',
      `[바이브 코딩 시뮬레이션] "${projectName}" 장치 구성 반영: ${sensorName}(${sensorPin}), ${actuatorName}(${actuatorPin})`,
      'USER'
    );
    if (onFeedbackMessage) {
      onFeedbackMessage(`"${projectName}" 핀맵이 대시보드 시뮬레이션에 반영되었습니다!`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs select-none p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  IoT 하드웨어 장치 관리 & 바이브 코딩
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Pico 2 W
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {mode === 'simulation' ? '시뮬레이션 모드' : `하드웨어 실기 연동 (${picoIp})`} · 학생 팀 프로젝트 맞춤형 장치 교체
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

        {/* 탭 전환 바 */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'current'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4 text-slate-500" />
            <span>현재 연결 핀맵 (기본 4종)</span>
          </button>
          <button
            onClick={() => setActiveTab('vibe')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'vibe'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>✨ AI 바이브 코딩 장치 변경/추가</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">학생 추천</span>
          </button>
        </div>

        {/* 탭 1: 현재 연결 핀맵 현황 */}
        {activeTab === 'current' && (
          <div className="flex flex-col gap-3.5 overflow-y-auto pr-1">
            <div className="flex flex-col gap-2">
              {referenceDevices.map((dev) => (
                <div
                  key={dev.id}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 flex items-center justify-between transition-colors"
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

            {/* AI 바이브 코딩 유도 배너 */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  우리 팀의 프로젝트 주제(스마트팜, 스마트팩토리 등)로 바꾸고 싶나요?
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  코드를 직접 짤 필요 없이, AI에게 원하는 센서와 모터를 말해주면 100% 자동 수정됩니다!
                </span>
              </div>
              <button
                onClick={() => setActiveTab('vibe')}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 shrink-0"
              >
                <span>AI 도우미 열기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 탭 2: AI 바이브 코딩 장치 변경/추가 도우미 */}
        {activeTab === 'vibe' && (
          <div className="flex flex-col gap-3.5 overflow-y-auto pr-1">
            {/* 1단계: 추천 프로젝트 프리셋 원클릭 선택 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>프로젝트 주제 프리셋 선택 (원클릭)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => {
                  const Icon = p.icon;
                  const isSelected = selectedPresetId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPreset(p)}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 truncate">{p.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${p.badgeColor}`}>
                            {p.badge}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 truncate mt-0.5">{p.description}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2단계: 센서 및 액추에이터 세부 핀 확인 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                <span>센서 및 액추에이터 세부 명칭 및 핀 설정</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* 센서 설정 */}
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    🌱 추가할 센서 (입력)
                  </span>
                  <input
                    type="text"
                    value={sensorName}
                    onChange={(e) => setSensorName(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:outline-blue-500"
                    placeholder="센서 이름 (예: 토양수분센서)"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={sensorPin}
                      onChange={(e) => setSensorPin(e.target.value)}
                      className="w-2/3 px-2.5 py-1 text-[11px] font-mono rounded-lg border border-slate-200 bg-white text-slate-800 font-bold focus:outline-blue-500"
                      placeholder="핀 (예: GP27)"
                    />
                    <input
                      type="text"
                      value={sensorUnit}
                      onChange={(e) => setSensorUnit(e.target.value)}
                      className="w-1/3 px-2 py-1 text-[11px] rounded-lg border border-slate-200 bg-white text-slate-800 text-center font-medium focus:outline-blue-500"
                      placeholder="단위 (%)"
                    />
                  </div>
                </div>

                {/* 액추에이터 설정 */}
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                    ⚙️ 추가할 액추에이터 (출력)
                  </span>
                  <input
                    type="text"
                    value={actuatorName}
                    onChange={(e) => setActuatorName(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:outline-blue-500"
                    placeholder="액추에이터 이름 (예: 워터 펌프)"
                  />
                  <input
                    type="text"
                    value={actuatorPin}
                    onChange={(e) => setActuatorPin(e.target.value)}
                    className="w-full px-2.5 py-1 text-[11px] font-mono rounded-lg border border-slate-200 bg-white text-slate-800 font-bold focus:outline-blue-500"
                    placeholder="핀 (예: GP21)"
                  />
                </div>
              </div>
            </div>

            {/* 3단계: 자동 생성된 AI 프롬프트 프리뷰 & 원클릭 복사 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>생성형 AI에게 보낼 맞춤 바이브 코딩 프롬프트</span>
                </label>
                <button
                  onClick={handleCopyPrompt}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? '복사 완료!' : '📋 AI 프롬프트 원클릭 복사'}</span>
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed max-h-36 overflow-y-auto select-all border border-slate-800">
                <pre className="whitespace-pre-wrap">{generatedPrompt}</pre>
              </div>
            </div>

            {/* 3단계 학생 바이브 코딩 가이드 박스 */}
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col gap-1">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                💡 <strong>초보자 바이브 코딩 3초 실행법:</strong>
              </span>
              <p className="text-[11px] text-amber-800 leading-normal">
                1️⃣ 위의 <strong>[📋 AI 프롬프트 원클릭 복사]</strong> 버튼을 누릅니다.<br />
                2️⃣ Antigravity (또는 ChatGPT/Claude) 대화창에 <code>Ctrl+V</code>(붙여넣기) 후 엔터를 칩니다.<br />
                3️⃣ AI가 가이드된 5개 파일(타입, 시뮬레이터, 핀맵, 3D 씬, UI)을 자동 수정한 뒤 즉시 동작을 확인합니다!
              </p>
            </div>
          </div>
        )}

        {/* 하단 버튼 툴바 */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {activeTab === 'vibe' ? (
            <button
              onClick={handleSimulateApply}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isSimulated
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-blue-600" />
              <span>{isSimulated ? '✓ 시뮬레이션 반영됨' : '🚀 대시보드에 모의 등록해보기'}</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              확인 및 닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
