'use client';

import React from 'react';
import { DoorObject } from './DoorObject';
import { LightObject } from './LightObject';
import { DhtSensorBadge } from './DhtSensorBadge';
import { CdsSensorNode } from './CdsSensorNode';
import { NeedsYouCallout3D } from './NeedsYouCallout3D';
import { Html } from '@react-three/drei';

interface SmartHomeRoomProps {
  approvalStatus?: 'pending' | 'approved';
  onApprove?: () => void;
  onReview?: () => void;
}

export function SmartHomeRoom({
  approvalStatus = 'pending',
  onApprove = () => {},
  onReview = () => {},
}: SmartHomeRoomProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* 0. Nomadian 스타일 입체 플로팅 아키텍처 페데스탈 베이스 (Floating White Pedestal) */}
      <mesh position={[0, -0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.8, 0.28, 5.8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.05} />
      </mesh>
      {/* 바닥 베이스 베벨 테두리 */}
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[5.9, 0.04, 5.9]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.4} />
      </mesh>

      {/* 1. 밝고 따뜻한 내추럴 오크 원목 바닥 (Oak Wood Floor) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[5.6, 5.6]} />
        <meshStandardMaterial color="#F2E6D5" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* 포근한 크림 아이보리 패브릭 러그 (Carpet Rug) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.2]} receiveShadow>
        <planeGeometry args={[3.2, 3.2]} />
        <meshStandardMaterial color="#FAF9F6" roughness={0.9} />
      </mesh>

      {/* 2. 산뜻하고 화사한 웜 화이트 뒷벽 (Back Wall) */}
      <mesh position={[0, 1.5, -2.75]} receiveShadow>
        <boxGeometry args={[5.6, 3.0, 0.1]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
      </mesh>

      {/* 뒷벽 하단 화이트 몰딩 걸레받이 (Baseboard) */}
      <mesh position={[0, 0.07, -2.69]} receiveShadow>
        <boxGeometry args={[5.6, 0.12, 0.03]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.4} />
      </mesh>

      {/* 3. 좌측 벽 (Left Wall - 도어 개구부 z: 0.58 ~ 1.82 사이 완전 개방) */}
      {/* 좌측 벽 뒤쪽 영역 (z: -2.75 ~ 0.58) */}
      <mesh position={[-2.75, 1.5, -1.08]} receiveShadow>
        <boxGeometry args={[0.1, 3.0, 3.33]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
      </mesh>
      {/* 도어 상단 인방 벽체 (z: 0.58 ~ 1.82, y: 2.5 ~ 3.0) */}
      <mesh position={[-2.75, 2.75, 1.2]} receiveShadow>
        <boxGeometry args={[0.1, 0.5, 1.24]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
      </mesh>
      {/* 좌측 벽 앞쪽 영역 (z: 1.82 ~ 2.8) */}
      <mesh position={[-2.75, 1.5, 2.31]} receiveShadow>
        <boxGeometry args={[0.1, 3.0, 0.98]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
      </mesh>

      {/* 4. 시원한 대형 통유리창 (Large Sunlit Window on Back Wall) */}
      <group position={[-0.8, 1.75, -2.7]}>
        <mesh>
          <boxGeometry args={[1.8, 1.35, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.6, 1.15]} />
          <meshStandardMaterial
            color="#E0F2FE"
            transparent
            opacity={0.3}
            roughness={0.05}
          />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.04, 1.15, 0.03]} />
          <meshStandardMaterial color="#E2E8F0" />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[1.6, 0.04, 0.03]} />
          <meshStandardMaterial color="#E2E8F0" />
        </mesh>
      </group>

      {/* 5. 창가 선반 (Window Shelf - Cds 조도 센서 위치) */}
      <mesh position={[-0.8, 0.98, -2.1]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.05, 0.45]} />
        <meshStandardMaterial color="#FAF5EE" roughness={0.3} />
      </mesh>
      <mesh position={[-1.3, 0.75, -2.2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.45]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.7} />
      </mesh>
      <mesh position={[-0.3, 0.75, -2.2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.45]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.7} />
      </mesh>

      {/* 6. Nomadian 스타일 프레젠테이션 화이트보드 차트 스탠드 (Whiteboard with Analytics) */}
      <group position={[-1.6, 0, -1.2]} rotation={[0, 0.35, 0]}>
        {/* 화이트보드 판 */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <boxGeometry args={[1.4, 0.9, 0.04]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        {/* 테두리 프레임 */}
        <mesh position={[0, 1.3, -0.01]}>
          <boxGeometry args={[1.46, 0.96, 0.03]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.3} />
        </mesh>
        {/* 스탠드 지지대 */}
        <mesh position={[-0.5, 0.65, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.3]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.5} />
        </mesh>
        <mesh position={[0.5, 0.65, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.3]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.5} />
        </mesh>
        {/* 스탠드 하단 바퀴 지지대 */}
        <mesh position={[-0.5, 0.04, 0]}>
          <boxGeometry args={[0.05, 0.05, 0.4]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
        <mesh position={[0.5, 0.04, 0]}>
          <boxGeometry args={[0.05, 0.05, 0.4]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>

        {/* 차트 시각화 미니 큐브들 */}
        {/* 오렌지색 상승 꺾은선/막대 */}
        <mesh position={[-0.35, 1.15, 0.03]}>
          <boxGeometry args={[0.08, 0.22, 0.01]} />
          <meshStandardMaterial color="#F97316" />
        </mesh>
        <mesh position={[-0.2, 1.25, 0.03]}>
          <boxGeometry args={[0.08, 0.42, 0.01]} />
          <meshStandardMaterial color="#3B82F6" />
        </mesh>
        <mesh position={[-0.05, 1.35, 0.03]}>
          <boxGeometry args={[0.08, 0.62, 0.01]} />
          <meshStandardMaterial color="#10B981" />
        </mesh>
        <mesh position={[0.2, 1.4, 0.03]}>
          <circleGeometry args={[0.14, 16]} />
          <meshStandardMaterial color="#8B5CF6" />
        </mesh>
      </group>

      {/* 7. 모던 화이트오크 데스크 (Desk Table - DHT11 위치) */}
      <group position={[1.65, 0, -1.2]}>
        <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.05, 0.8]} />
          <meshStandardMaterial color="#F5E6D3" roughness={0.4} />
        </mesh>
        {[[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]].map(([dx, dz], idx) => (
          <mesh key={idx} position={[dx, 0.42, dz]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.84]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.2} roughness={0.2} />
          </mesh>
        ))}

        {/* 데스크 위 작은 화분 */}
        <group position={[-0.45, 0.95, -0.2]}>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.12, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#16A34A" roughness={0.6} />
          </mesh>
        </group>

        {/* 데스크 이름표 뱃지 */}
        <Html position={[0, 1.05, 0]} center distanceFactor={8}>
          <div className="px-2 py-0.5 rounded-full bg-white/90 border border-slate-200 shadow-2xs text-[10px] font-bold text-slate-700 whitespace-nowrap">
            DHT11 센서 노드
          </div>
        </Html>
      </group>

      {/* 8. 중앙 라운드 미팅 테이블 (Round Meeting Table - Miro 자리) */}
      <group position={[0.2, 0, -0.2]}>
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.04, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.37, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.74, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.03, 24]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.4} />
        </mesh>

        {/* 미팅 테이블 위 웹캠/스마트 허브 */}
        <mesh position={[0, 0.82, 0]} castShadow>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>

        {/* Pico 2 W 태그 */}
        <Html position={[0, 0.98, 0]} center distanceFactor={8}>
          <div className="px-2 py-0.5 rounded-full bg-slate-900 text-white shadow-2xs text-[10px] font-bold whitespace-nowrap flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Pico 2 W 제어기</span>
          </div>
        </Html>
      </group>

      {/* 9. 트렌디한 파스텔 틸 모던 소파 (Modern Sofa) */}
      <group position={[0, 0, 1.4]}>
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.28, 0.85]} />
          <meshStandardMaterial color="#0284C7" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.65, 0.33]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.42, 0.22]} />
          <meshStandardMaterial color="#0369A1" roughness={0.6} />
        </mesh>
        <mesh position={[-0.98, 0.48, 0.02]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.38, 0.85]} />
          <meshStandardMaterial color="#0369A1" roughness={0.6} />
        </mesh>
        <mesh position={[0.98, 0.48, 0.02]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.38, 0.85]} />
          <meshStandardMaterial color="#0369A1" roughness={0.6} />
        </mesh>
        {[[-0.85, -0.3], [0.85, -0.3], [-0.85, 0.3], [0.85, 0.3]].map(([sx, sz], i) => (
          <mesh key={i} position={[sx, 0.09, sz]} castShadow>
            <cylinderGeometry args={[0.02, 0.015, 0.18]} />
            <meshStandardMaterial color="#B45309" roughness={0.5} />
          </mesh>
        ))}

        {/* 휴식 공간 태그 */}
        <Html position={[0.7, 0.9, 0]} center distanceFactor={8}>
          <div className="px-2 py-0.5 rounded-full bg-white/90 border border-slate-200 shadow-2xs text-[10px] font-bold text-slate-700 whitespace-nowrap">
            스마트 휴식 공간
          </div>
        </Html>
      </group>

      {/* 10. 거실 플로어 대형 관엽식물 (Monstera Plant in Corner) */}
      <group position={[2.1, 0, 1.8]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.17, 0.5, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.65, 0]} castShadow>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshStandardMaterial color="#15803D" roughness={0.5} />
        </mesh>
      </group>

      {/* 11. 하드웨어 연동 장치 4종 */}
      <DoorObject />
      <LightObject />
      <DhtSensorBadge />
      <CdsSensorNode />

      {/* 12. Nomadian 스타일 3D 승인 말풍선 (NEEDS YOU Callout Bubble) */}
      <NeedsYouCallout3D
        approvalStatus={approvalStatus}
        onApprove={onApprove}
        onReview={onReview}
      />
    </group>
  );
}
