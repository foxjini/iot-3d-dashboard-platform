'use client';

import React from 'react';
import { DoorObject } from './DoorObject';
import { LightObject } from './LightObject';
import { DhtSensorBadge } from './DhtSensorBadge';
import { CdsSensorNode } from './CdsSensorNode';

export function SmartHomeRoom() {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. 밝고 따뜻한 내추럴 오크 원목 바닥 (Oak Wood Floor) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[5.6, 5.6]} />
        <meshStandardMaterial color="#D8B486" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* 포근한 크림 아이보리 패브릭 러그 (Carpet Rug) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0.2]} receiveShadow>
        <planeGeometry args={[3.2, 3.2]} />
        <meshStandardMaterial color="#FAF9F6" roughness={0.9} />
      </mesh>

      {/* 2. 산뜻하고 화사한 웜 화이트 뒷벽 (Back Wall) */}
      <mesh position={[0, 1.5, -2.75]} receiveShadow>
        <boxGeometry args={[5.6, 3.0, 0.1]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
      </mesh>

      {/* 뒷벽 하단 화이트 몰딩 걸레받이 (Baseboard) */}
      <mesh position={[0, 0.06, -2.69]} receiveShadow>
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
        {/* 화이트 창틀 외경 */}
        <mesh>
          <boxGeometry args={[1.8, 1.35, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* 투명 유리창 */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.6, 1.15]} />
          <meshStandardMaterial
            color="#E0F2FE"
            transparent
            opacity={0.3}
            roughness={0.05}
          />
        </mesh>
        {/* 창살 십자 프레임 */}
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
      {/* 선반 메탈 지지대 */}
      <mesh position={[-1.3, 0.75, -2.2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.45]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.7} />
      </mesh>
      <mesh position={[-0.3, 0.75, -2.2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.45]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.7} />
      </mesh>

      {/* 6. 모던 화이트오크 데스크 (Desk Table - DHT11 위치) */}
      <group position={[1.65, 0, -1.2]}>
        {/* 데스크 상판 */}
        <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.05, 0.8]} />
          <meshStandardMaterial color="#F5E6D3" roughness={0.4} />
        </mesh>
        {/* 슬림 화이트 메탈 다리 4개 */}
        {[[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]].map(([dx, dz], idx) => (
          <mesh key={idx} position={[dx, 0.42, dz]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.84]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.2} roughness={0.2} />
          </mesh>
        ))}

        {/* 데스크 위 작은 화분 (Green Plant) */}
        <group position={[-0.45, 0.95, -0.2]}>
          {/* 화분 */}
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.12, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          {/* 식물 잎 */}
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#16A34A" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* 7. 트렌디한 파스텔 틸 모던 소파 (Modern Sofa) */}
      <group position={[0, 0, 1.3]}>
        {/* 좌방석 */}
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.28, 0.85]} />
          <meshStandardMaterial color="#0284C7" roughness={0.6} />
        </mesh>
        {/* 등받이 */}
        <mesh position={[0, 0.65, 0.33]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.42, 0.22]} />
          <meshStandardMaterial color="#0369A1" roughness={0.6} />
        </mesh>
        {/* 팔걸이 좌/우 */}
        <mesh position={[-0.98, 0.48, 0.02]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.38, 0.85]} />
          <meshStandardMaterial color="#0369A1" roughness={0.6} />
        </mesh>
        <mesh position={[0.98, 0.48, 0.02]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.38, 0.85]} />
          <meshStandardMaterial color="#0369A1" roughness={0.6} />
        </mesh>
        {/* 소파 원목 다리 4개 */}
        {[[-0.85, -0.3], [0.85, -0.3], [-0.85, 0.3], [0.85, 0.3]].map(([sx, sz], i) => (
          <mesh key={i} position={[sx, 0.09, sz]} castShadow>
            <cylinderGeometry args={[0.02, 0.015, 0.18]} />
            <meshStandardMaterial color="#B45309" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* 8. 거실 플로어 대형 관엽식물 (Monstera Plant in Corner) */}
      <group position={[2.1, 0, 1.8]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.17, 0.5, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* 푸른 잎사귀들 */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshStandardMaterial color="#15803D" roughness={0.5} />
        </mesh>
      </group>

      {/* 9. 하드웨어 연동 장치 조립 */}
      <DoorObject />
      <LightObject />
      <DhtSensorBadge />
      <CdsSensorNode />
    </group>
  );
}
