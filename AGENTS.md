# AI Agent Guide - 3D IoT Dashboard Platform

## 1. 프로젝트 개요
본 플랫폼은 고등학교 학생 팀 프로젝트를 위해 설계된 **스마트홈 3D IoT 공통 개발 플랫폼**입니다.
기본 레퍼런스로 다음 4종 하드웨어가 3D 가상 공간 및 Pico 2 W 펌웨어와 End-to-End로 결합되어 있습니다:
- **DHT11**: 디지털 온습도 센서 (Pin: GP15)
- **Cds**: 아날로그 조도 센서 (Pin: GP26 / ADC0)
- **SG90**: 서보모터 (Pin: GP16 / PWM) - 3D 스마트 도어 회전과 연동
- **RGB LED**: 공통 캐소드 3색 LED (Pins: GP18, GP19, GP20 / PWM) - 3D 조명 발광과 연동

## 2. 학생들의 바이브 코딩 (Context Engineering) 지원 체계
학생들이 프로젝트 주제(스마트팜, 스마트팩토리 등)를 바꿀 때 AI는 다음 순서로 지원해야 합니다:
1. `context/CONTEXT_CIRCUITPYTHON_MAP.md`를 기반으로 센서/액추에이터 핀 및 REST 핸들러 추가
2. `src/core/types/iot.ts`에 신규 장치 타입 추가
3. `src/core/adapter/MockIoTAdapter.ts`에 시뮬레이션용 데이터 생성기 추가
4. `src/components/3d/`에 3D 씬 오브젝트(R3F 컴포넌트) 추가 또는 가구 배치 변경
5. `src/components/ui/ControlDrawer.tsx` 또는 `SensorCards.tsx`에 제어 위젯 추가

모든 AI 에이전트는 환각(Hallucination) 없이 일관된 코드 품질을 유지해야 합니다.
