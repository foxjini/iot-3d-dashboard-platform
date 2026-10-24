'use client';

import React, { useState } from 'react';
import { useIoTStore } from '@/core/store/useIoTStore';
import { Terminal, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

export function EventLogFeed() {
  const logs = useIoTStore((s) => s.logs);
  const clearLogs = useIoTStore((s) => s.clearLogs);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute left-4 bottom-4 z-20 pointer-events-auto max-w-lg w-full">
      <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-2xl overflow-hidden transition-all duration-300">
        {/* 헤더 바 */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>실시간 시스템 로그 ({logs.length})</span>
          </div>
          <div className="flex items-center gap-2">
            {isOpen && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearLogs();
                }}
                className="text-slate-400 hover:text-slate-200 p-1"
                title="로그 비우기"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>

        {/* 접힌 상태에서는 최신 1개만 한 줄로 미리보기 */}
        {!isOpen && logs.length > 0 && (
          <div className="px-4 py-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 truncate flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                logs[0].type === 'error'
                  ? 'bg-rose-400'
                  : logs[0].type === 'warn'
                  ? 'bg-amber-400'
                  : logs[0].type === 'success'
                  ? 'bg-emerald-400'
                  : 'bg-blue-400'
              }`}
            />
            <span className="font-mono text-slate-500">
              [{logs[0].source}]
            </span>
            <span className="truncate">{logs[0].message}</span>
          </div>
        )}

        {/* 펼친 상태에서는 스크롤 피드 */}
        {isOpen && (
          <div className="p-3 max-h-48 overflow-y-auto flex flex-col gap-1.5 border-t border-slate-800 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-slate-500 text-center py-4 text-[11px]">
                기록된 이벤트가 없습니다.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-2 text-[11px] leading-tight"
                >
                  <span className="text-slate-500 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                  <span
                    className={`font-semibold shrink-0 px-1 rounded text-[9px] ${
                      log.source === 'PICO_2W'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : log.source === 'MOCK'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : log.source === 'USER'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {log.source}
                  </span>
                  <span
                    className={`break-all ${
                      log.type === 'error'
                        ? 'text-rose-400 font-medium'
                        : log.type === 'warn'
                        ? 'text-amber-300'
                        : log.type === 'success'
                        ? 'text-emerald-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
