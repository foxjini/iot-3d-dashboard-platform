'use client';

import React, { useState } from 'react';
import { useIoTStore } from '@/core/store/useIoTStore';
import { Terminal, Trash2, Filter, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export function ControlLogPanel() {
  const logs = useIoTStore((s) => s.logs);
  const clearLogs = useIoTStore((s) => s.clearLogs);
  const [filterSource, setFilterSource] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    if (filterSource === 'ALL') return true;
    return log.source === filterSource;
  });

  return (
    <aside className="w-[340px] h-full flex flex-col bg-[#F8FAFC] border-l border-slate-200/80 p-4 gap-3 shrink-0 overflow-y-auto select-none">
      {/* 1. 상단 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">제어 및 시스템 로그</h2>
            <span className="text-[10px] text-slate-400">총 {logs.length}건 기록됨</span>
          </div>
        </div>

        <button
          onClick={clearLogs}
          className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-2xs"
          title="로그 비우기"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. 로그 출처 필터 칩 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'ALL', name: '전체' },
          { id: 'PICO_2W', name: 'Pico 2 W' },
          { id: 'MOCK', name: '시뮬레이터' },
          { id: 'USER', name: '사용자 명령' },
          { id: 'SYSTEM', name: '시스템' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterSource(f.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
              filterSource === f.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* 3. 로그 스트림 피드 */}
      <div className="flex-1 bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs overflow-y-auto flex flex-col gap-2 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs flex flex-col items-center gap-2">
            <Info className="w-6 h-6 text-slate-300" />
            <span>기록된 로그가 없습니다.</span>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-2 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col gap-1 text-[11px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    log.source === 'PICO_2W'
                      ? 'bg-emerald-100 text-emerald-700'
                      : log.source === 'USER'
                      ? 'bg-blue-100 text-blue-700'
                      : log.source === 'MOCK'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {log.source}
                </span>
              </div>
              <span className="text-slate-800 font-sans leading-relaxed break-all">
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
