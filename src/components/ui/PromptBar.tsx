'use client';

import React, { useState } from 'react';
import { Paperclip, Send, Sparkles } from 'lucide-react';
import { useIoTStore } from '@/core/store/useIoTStore';

interface PromptBarProps {
  onFeedbackMessage?: (msg: string) => void;
}

export function PromptBar({ onFeedbackMessage }: PromptBarProps) {
  const [inputText, setInputText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const setServoAngle = useIoTStore((s) => s.setServoAngle);
  const setRgbColor = useIoTStore((s) => s.setRgbColor);
  const setRgbState = useIoTStore((s) => s.setRgbState);
  const sensors = useIoTStore((s) => s.sensors);
  const addLog = useIoTStore((s) => s.addLog);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    setInputText('');
    setIsReplying(true);
    addLog('info', `사용자 프롬프트 명령: "${text}"`, 'USER');

    const lower = text.toLowerCase();

    setTimeout(() => {
      setIsReplying(false);

      if (lower.includes('열') || lower.includes('open') || lower.includes('90')) {
        setServoAngle(90);
        addLog('success', 'Pico AI 코어: "스마트 도어를 90도로 개방했습니다."', 'SYSTEM');
        if (onFeedbackMessage) onFeedbackMessage('스마트 도어를 90도로 개방했습니다.');
      } else if (lower.includes('닫') || lower.includes('close') || lower.includes('0도') || lower.includes('0')) {
        setServoAngle(0);
        addLog('success', 'Pico AI 코어: "스마트 도어를 닫았습니다."', 'SYSTEM');
        if (onFeedbackMessage) onFeedbackMessage('스마트 도어를 닫았습니다.');
      } else if (lower.includes('불 꺼') || lower.includes('조명 꺼') || lower.includes('off')) {
        setRgbState('OFF');
        addLog('success', 'Pico AI 코어: "실내 무드등을 껐습니다."', 'SYSTEM');
        if (onFeedbackMessage) onFeedbackMessage('실내 무드등을 껐습니다.');
      } else if (lower.includes('불 켜') || lower.includes('조명 켜') || lower.includes('on')) {
        setRgbState('ON');
        addLog('success', 'Pico AI 코어: "실내 무드등을 켰습니다."', 'SYSTEM');
        if (onFeedbackMessage) onFeedbackMessage('실내 무드등을 켰습니다.');
      } else if (lower.includes('빨간') || lower.includes('레드') || lower.includes('red')) {
        setRgbColor('#EF4444');
        setRgbState('ON');
        addLog('success', 'Pico AI 코어: "무드등 색상을 선셋 레드로 설정했습니다."', 'SYSTEM');
        if (onFeedbackMessage) onFeedbackMessage('무드등을 선셋 레드로 변경했습니다.');
      } else if (lower.includes('파란') || lower.includes('블루') || lower.includes('blue')) {
        setRgbColor('#3B82F6');
        setRgbState('ON');
        addLog('success', 'Pico AI 코어: "무드등 색상을 오션 블루로 설정했습니다."', 'SYSTEM');
        if (onFeedbackMessage) onFeedbackMessage('무드등을 오션 블루로 변경했습니다.');
      } else if (lower.includes('초록') || lower.includes('그린') || lower.includes('green')) {
        setRgbColor('#10B981');
        setRgbState('ON');
        addLog('success', 'Pico AI 코어: "무드등 색상을 네온 에메랄드로 설정했습니다."', 'SYSTEM');
        if (onFeedbackMessage) onFeedbackMessage('무드등을 네온 에메랄드로 변경했습니다.');
      } else if (lower.includes('보라') || lower.includes('퍼플') || lower.includes('purple')) {
        setRgbColor('#A855F7');
        setRgbState('ON');
        addLog('success', 'Pico AI 코어: "무드등 색상을 로맨틱 퍼플로 설정했습니다."', 'SYSTEM');
        if (onFeedbackMessage) onFeedbackMessage('무드등을 로맨틱 퍼플로 변경했습니다.');
      } else if (lower.includes('온도') || lower.includes('습도') || lower.includes('상태') || lower.includes('날씨')) {
        const msg = `현재 실내 온도는 ${sensors.dht11_temp.value.toFixed(1)}℃, 습도는 ${sensors.dht11_humi.value.toFixed(0)}%, 조도는 ${sensors.cds_light.value} ADC 입니다.`;
        addLog('success', `Pico AI 코어: "${msg}"`, 'SYSTEM');
        if (onFeedbackMessage) onFeedbackMessage(msg);
      } else {
        const msg = `명령 "${text}"을(를) 확인했습니다. 정상적으로 자동화 제어를 수행합니다.`;
        addLog('info', `Pico AI 코어: "${msg}"`, 'SYSTEM');
        if (onFeedbackMessage) onFeedbackMessage(msg);
      }
    }, 350);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-3 py-2 flex items-center gap-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400">
        {/* @Pico 태그 뱃지 */}
        <div className="flex items-center gap-1.5 bg-slate-950 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shrink-0 cursor-pointer hover:bg-slate-800 transition-colors">
          <span>@Pico</span>
        </div>

        {/* 텍스트 입력 필드 */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={
            isReplying
              ? 'Pico 2 W가 명령을 분석하여 제어하는 중입니다...'
              : '무엇이든 명령하세요 — 예: "문 90도 열어줘", "조명 파란색 켜줘", "현재 온도 어때?"'
          }
          disabled={isReplying}
          className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 font-medium outline-none"
        />

        {/* 첨부파일 클립 아이콘 */}
        <button
          type="button"
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          title="파일/규칙 첨부"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* 전송 버튼 (종이비행기) */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!inputText.trim() || isReplying}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            inputText.trim() && !isReplying
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              : 'text-slate-300 hover:text-slate-400'
          }`}
          title="명령 전송"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
