# CONTEXT_SYSTEM_SPEC: 플랫폼 아키텍처 및 시스템 규격

이 문서는 AI에게 본 프로젝트의 전체 시스템 구조와 코딩 규칙을 전달하기 위한 Context 문서입니다.

## 1. 아키텍처 개요
본 플랫폼은 크게 4개의 레이어로 나뉩니다:

```
[UI Layer (Next.js 14 / React 18)]
   ├── 3D Canvas (R3F Scene / SmartHomeRoom)
   ├── 2D Classic Dashboard (/2d)
   └── Glassmorphism HUD (Header, ControlDrawer, EventLog)
          ↕ (Zustand 스토어 구독 및 디스패치)
[Domain & State Layer]
   └── useIoTStore.ts (센서/액추에이터 캐시, 연결 상태, 2-Phase 락)
          ↕ (IIoTAdapter 인터페이스)
[Adapter Layer]
   ├── MockIoTAdapter.ts (오프라인/시뮬레이션 모드)
   └── CircuitPythonAdapter.ts (Pico 2 W Wi-Fi REST 통신)
          ↕ (Wi-Fi HTTP REST)
[Hardware Layer (Raspberry Pi Pico 2 W)]
   └── CircuitPython 9.x/10.x (code.py)
```

## 2. 상태 관리 (Zustand) 규칙
- `src/core/store/useIoTStore.ts`는 모든 장치의 단일 진실 공급원입니다.
- 센서 데이터 (`sensors`): `dht11_temp`, `dht11_humi`, `cds_light`
- 액추에이터 데이터 (`actuators`): `sg90_door`, `rgb_light`
- 2-Phase 명령 전송 흐름:
  1. UI에서 `sendCommand(deviceId, value)` 호출
  2. 스토어는 해당 장치의 `pending = true`로 설정 (중복 클릭 방지)
  3. 어댑터가 Pico 2 W 또는 시뮬레이터로 전송
  4. 응답 성공 시 `pending = false`, `reportedState = value` 갱신
  5. 5초 내 응답 없을 시 자동 롤백 및 에러 로그 기록

## 3. 컴포넌트 개발 규칙
- **3D 컴포넌트**: `src/components/3d/` 내부에 위치하며, React Three Fiber 및 Drei 훅(`useFrame`, `useThree`)을 사용합니다.
- **SSR 방지**: Three.js Canvas는 브라우저 전용이므로 `src/components/3d/SceneCanvas.tsx`에서 `next/dynamic`(`ssr: false`)으로 렌더링해야 합니다.
- **스타일링**: TailwindCSS를 기본으로 사용하며 다크 모드 글래스모피즘(`backdrop-blur-md bg-slate-900/80 border border-slate-700/50`) 스타일을 준수합니다.
