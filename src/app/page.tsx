'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { NavRail } from '@/components/ui/NavRail';
import { RoomsSidebar, RoomItem } from '@/components/ui/RoomsSidebar';
import { CenterHeader } from '@/components/ui/CenterHeader';
import { InspectorPanel } from '@/components/ui/InspectorPanel';
import { SensorOutputPanel } from '@/components/ui/SensorOutputPanel';
import { ControlLogPanel } from '@/components/ui/ControlLogPanel';
import { PromptBar } from '@/components/ui/PromptBar';
import { PicoIpModal } from '@/components/ui/PicoIpModal';
import { DeviceManageModal } from '@/components/ui/DeviceManageModal';
import { ScheduleModal } from '@/components/ui/ScheduleModal';
import { AddRoomModal } from '@/components/ui/AddRoomModal';
import { ReviewModal } from '@/components/ui/ReviewModal';
import { ExhibitionOverlay } from '@/components/ui/ExhibitionOverlay';
import { useIoTStore } from '@/core/store/useIoTStore';
import { Loader2, ArrowLeft, SlidersHorizontal, Calendar } from 'lucide-react';

// R3F 3D Canvas는 브라우저 전용이므로 SSR 완전 해제
const SceneCanvas = dynamic(
  () => import('@/components/3d/SceneCanvas').then((mod) => mod.SceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#EFF2F6] text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-sm font-semibold tracking-wide text-slate-700">
          스마트홈 3D 가상 공간 렌더링 중...
        </span>
      </div>
    ),
  }
);

const INITIAL_ROOMS: RoomItem[] = [
  {
    id: 'marketing',
    name: '스마트 거실 허브',
    sensorsDesc: '센서 3종 · 액추에이터 2종',
    iconType: 'home',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
  },
  {
    id: 'new_project',
    name: '스마트 팜 온실',
    sensorsDesc: '온습도 & 토양 제어',
    iconType: 'farm',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
  },
  {
    id: 'dev_qa',
    name: '스마트 팩토리 공정',
    sensorsDesc: '모터 및 컨베이어 감지',
    iconType: 'factory',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
  },
  {
    id: 'product_design',
    name: '조명 & 환경 허브',
    sensorsDesc: 'RGB LED · 조도 연동',
    iconType: 'sparkles',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700',
    hasNotification: true,
  },
  {
    id: 'ops_admin',
    name: '출입 & 도어 보안',
    sensorsDesc: 'SG90 서보 · 도어락',
    iconType: 'shield',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-700',
    hasNotification: true,
  },
];

export default function HomePage() {
  const [activeRoomId, setActiveRoomId] = useState('marketing');
  const [roomList, setRoomList] = useState<RoomItem[]>(INITIAL_ROOMS);
  const [activeNavTab, setActiveNavTab] = useState('space');
  const [activeCenterTab, setActiveCenterTab] = useState<'inspector' | 'output' | 'thread'>('inspector');

  // 모달 상태 관리
  const [showIpModal, setShowIpModal] = useState(false);
  const [showDeviceManageModal, setShowDeviceManageModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved'>('pending');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const setServoAngle = useIoTStore((s) => s.setServoAngle);
  const addLog = useIoTStore((s) => s.addLog);

  const currentRoom = roomList.find((r) => r.id === activeRoomId) || roomList[0];

  const handleApproveProposal = () => {
    setApprovalStatus('approved');
    setServoAngle(90);
    addLog('success', '스마트 환기 제어 요청 승인: 스마트 도어가 90°로 개방되었습니다.', 'USER');
    showToast('승인 완료: 스마트 도어가 90°로 개방되었습니다.');
  };

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4000);
  };

  const handleAddRoom = (newRoom: RoomItem) => {
    setRoomList((prev) => [...prev, newRoom]);
    setActiveRoomId(newRoom.id);
    showToast(`새 공간 "${newRoom.name}"이(가) 등록되었습니다.`);
    addLog('info', `새 모니터링 공간 등록: ${newRoom.name}`, 'USER');
  };

  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === 'telemetry') {
      setActiveCenterTab('output');
      showToast('실시간 센서 출력 모드로 전환되었습니다.');
    } else if (tab === 'control') {
      setActiveCenterTab('inspector');
      showToast('하드웨어 제어 인스펙터로 전환되었습니다.');
    } else if (tab === 'space') {
      showToast('3D 가상 공간 뷰로 전환되었습니다.');
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#EFF2F6] text-slate-800 flex select-none">
      {/* 1. 최좌측 슬림 세로 내비게이션 레일 (NavRail) */}
      <NavRail
        activeNavTab={activeNavTab}
        setActiveNavTab={handleNavTabChange}
        onOpenIpModal={() => setShowIpModal(true)}
      />

      {/* 2. 좌측 모니터링 공간 목록 사이드바 (스마트 공간) */}
      <RoomsSidebar
        activeRoomId={activeRoomId}
        roomList={roomList}
        onSelectRoom={(id) => {
          setActiveRoomId(id);
          const found = roomList.find((r) => r.id === id);
          if (found) showToast(`"${found.name}" 구역으로 모니터링이 전환되었습니다.`);
        }}
        onOpenAddRoomModal={() => setShowAddRoomModal(true)}
        onOpenScheduleModal={() => setShowScheduleModal(true)}
      />

      {/* 3. 중앙 3D 가상 공간 워크스페이스 */}
      <section className="flex-1 flex flex-col relative h-full overflow-hidden bg-gradient-to-b from-[#F2F4F8] via-[#EDF1F7] to-[#E6EBF2]">
        {/* 상단 헤더 (공간명, 실시간 인디케이터, 세그먼트 탭 필) */}
        <CenterHeader
          roomName={currentRoom.name}
          activeTab={activeCenterTab}
          onTabChange={setActiveCenterTab}
          onOpenIpModal={() => setShowIpModal(true)}
        />

        {/* 메인 3D 가상 공간 캔버스 */}
        <div className="flex-1 relative w-full h-full overflow-hidden">
          <SceneCanvas
            roomId={activeRoomId}
            approvalStatus={approvalStatus}
            onApprove={handleApproveProposal}
            onReview={() => setShowReviewModal(true)}
            isModalOpen={
              showIpModal ||
              showDeviceManageModal ||
              showScheduleModal ||
              showAddRoomModal ||
              showReviewModal
            }
          />

          {/* 3D 뷰 캔버스 하단 오버레이 버튼들 */}
          {/* 좌하단: ← 전체 조감도 */}
          <div className="absolute left-6 bottom-6 z-10 pointer-events-auto">
            <button
              onClick={() => {
                setActiveRoomId('marketing');
                showToast('메인 라운지 전체 조감도로 전환되었습니다.');
              }}
              className="px-4 py-2 rounded-full bg-white/90 hover:bg-white text-xs font-bold text-slate-700 shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-slate-200/80 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>전체 조감도</span>
            </button>
          </div>

          {/* 우하단: 장치 관리 & 스케줄 캘린더 */}
          <div className="absolute right-6 bottom-6 z-10 pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => setShowDeviceManageModal(true)}
              className="px-4 py-2 rounded-full bg-white/90 hover:bg-white text-xs font-bold text-slate-700 shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-slate-200/80 transition-all flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>장치 관리</span>
            </button>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-slate-200/80 transition-all flex items-center justify-center"
              title="자동화 스케줄"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>

          {/* 하단 중앙 플로팅 프롬프트 바 (@Pico — 무엇이든 명령하세요) */}
          <PromptBar onFeedbackMessage={showToast} />
        </div>
      </section>

      {/* 4. 우측 탭 연동 패널: 장치 인스펙터 vs 센서 출력 vs 제어 로그 */}
      {activeCenterTab === 'inspector' && (
        <InspectorPanel
          approvalStatus={approvalStatus}
          onApproveProposal={handleApproveProposal}
          onOpenReviewModal={() => setShowReviewModal(true)}
        />
      )}

      {activeCenterTab === 'output' && <SensorOutputPanel />}

      {activeCenterTab === 'thread' && <ControlLogPanel />}

      {/* 5. 피드백 토스트 알림 */}
      {feedbackToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold tracking-tight flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* 6. 모달 4종 (Pico IP, 장치 관리, 자동화 스케줄, 새 공간 추가, 상태 검토) */}
      <PicoIpModal
        isOpen={showIpModal}
        onClose={() => setShowIpModal(false)}
      />

      <DeviceManageModal
        isOpen={showDeviceManageModal}
        onClose={() => setShowDeviceManageModal(false)}
      />

      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />

      <AddRoomModal
        isOpen={showAddRoomModal}
        onClose={() => setShowAddRoomModal(false)}
        onAddRoom={handleAddRoom}
      />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onApprove={handleApproveProposal}
      />

      {/* 7. 부스 전시 모드 오버레이 */}
      <ExhibitionOverlay />
    </main>
  );
}
