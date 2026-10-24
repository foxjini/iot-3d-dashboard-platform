# 🌐 3D IoT 대시보드 플랫폼 (3D IoT Dashboard Platform)

> **고등학교 학생 팀 프로젝트를 위한 스마트홈 3D IoT 공통 개발 플랫폼 & 생성형 AI 바이브 코딩(Context Engineering) 베이스라인**

[![Next.js 14](https://img.shields.io/badge/Next.js-14_LTS-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F_v8-black?style=flat-square&logo=three.js)](https://docs.pmnd.rs/react-three-fiber/)
[![Zustand](https://img.shields.io/badge/Zustand-4.5-orange?style=flat-square)](https://github.com/pmndrs/zustand)
[![CircuitPython](https://img.shields.io/badge/CircuitPython-9.x%2F10.x-green?style=flat-square&logo=python)](https://circuitpython.org/)
[![Raspberry Pi Pico 2 W](https://img.shields.io/badge/Pico_2_W-RP2350_WiFi-C51A4A?style=flat-square&logo=raspberrypi)](https://www.raspberrypi.com/)

---

## 📖 목차
1. [프로젝트 소개](#-프로젝트-소개)
2. [핵심 기능 및 특징](#-핵심-기능-및-특징)
3. [시스템 아키텍처](#-시스템-아키텍처)
4. [4대 레퍼런스 하드웨어 핀맵](#-4대-레퍼런스-하드웨어-핀맵)
5. [빠른 시작 가이드](#-빠른-시작-가이드-quick-start)
6. [하드웨어 연동 및 모의(Mock) 테스트](#-하드웨어-연동-및-모의mock-테스트)
7. [생성형 AI 바이브 코딩 5단계 프로토콜](#-생성형-ai-바이브-코딩-5단계-프로토콜)
8. [대시보드 실전 매뉴얼 안내](#-대시보드-실전-매뉴얼-안내)
9. [디버깅 & 트러블슈팅 가이드](#-디버깅--트러블슈팅-가이드)

---

## 💡 프로젝트 소개

본 플랫폼은 고등학교 학생들이 팀별 프로젝트(스마트팜, 스마트팩토리, 스마트물류/보안, 스마트케어 등)를 제작할 때, 
밑바닥부터 코드를 작성하느라 겪는 어려움을 해소하기 위해 설계된 **풀스택 3D IoT 공통 베이스라인**입니다.

- **브라우저 3D 가상 공간(Three.js / React Three Fiber)**과 **물리 마이크로컨트롤러(Raspberry Pi Pico 2 W)**가 엔드투엔드로 동기화됩니다.
- 실제 하드웨어 없이도 모든 기능이 동작하는 **시뮬레이션 모드**와 Wi-Fi 기반 **하드웨어 연동 모드**를 원클릭으로 전환할 수 있습니다.
- 교실이나 실습실에서 실제 Pico 보드가 없어도 100% 동일한 REST 통신을 검증할 수 있는 **Mock 서버(`firmware/mock_pico_server.js`)**를 제공합니다.
- 복잡한 코드 작성 대신 생성형 AI(ChatGPT, Claude, Gemini, Cursor)에게 단 하나의 컨텍스트 파일(`context/PLATFORM_FULL_CONTEXT.md`)을 전달하여 주제별로 100% 환각 없는 코드를 생성하는 **바이브 코딩(Context Engineering) 체계**를 완비했습니다.

---

## ✨ 핵심 기능 및 특징

### 1. 3D 디지털 트윈 & 실시간 텔레메트리
- **3D 인터랙티브 룸**: 문 개폐, 조명 발광, 온습도 플로팅 배지, 조도에 따른 앰비언트 광량 자동 동기화.
- **Drei 레이어링 최적화**: 3D 어노테이션 메시지가 UI 모달(z-100)을 침범하지 않도록 `zIndexRange={[10, 0]}` 제어 및 4.5초 자동 소멸 타이머 탑재.
- **2D/3D 전환**: 공간 인지 3D 뷰와 클래식 2D 대시보드 자유 전환.

### 2. 2-Phase Acknowledgment (신뢰성 제어)
- 액추에이터 제어 명령 발송 시 `pending` 상태로 UI를 보호하고, 물리 하드웨어 또는 시뮬레이터의 실제 응답(ACK)을 확인한 뒤 최종 확정.

### 3. 멀티탭 인스펙터 & 실시간 센서 패널
- **장치 제어 탭**: SG90 서보모터 각도 슬라이더(0°~180°) 및 RGB LED 프리셋 컬러 피커.
- **실시간 센서 출력(Telemetry) 탭**: 게이지 바, 원시 16비트 ADC 수치 스트림, 실시간 **CSV 데이터 내보내기**.
- **제어 이력 로그 탭**: 하드웨어, 사용자, 시뮬레이터, 시스템별 이벤트 필터링 스트림.

### 4. 확장 모달 & 지능형 자연어 명령
- **장비 핀아웃 점검 모달**: 4대 기본 하드웨어 연결 상태 점검 및 즉시 테스트.
- **이벤트 구동 자동화 스케줄러**: 5대 임계치/시간 조건 기반 자동화 규칙 토글.
- **한국어 자연어 프롬프트 바**: "문 열어", "조명 켜", "온도 새로고침" 등의 한국어 명령 실시간 파싱 및 실행.

---

## 🏗️ 시스템 아키텍처

```mermaid
graph TD
    subgraph Frontend [Next.js 14 App Router]
        Store[Zustand useIoTStore<br/>Single Source of Truth]
        UI[UI Panels & Modals<br/>z-[100] Layering]
        R3F[React Three Fiber<br/>SceneCanvas & SmartHomeRoom]
        Proxy[/api/pico/...path<br/>CORS 회피 프록시]
        
        Store <--> UI
        Store <--> R3F
    end

    subgraph Adapters [통신 추상화 어댑터 계층]
        IIoTAdapter[IIoTAdapter Interface]
        MockAdapter[MockIoTAdapter<br/>가상 난수 발생기]
        CPAdapter[CircuitPythonAdapter<br/>REST Polling & Command]
        
        IIoTAdapter --> MockAdapter
        IIoTAdapter --> CPAdapter
    end

    subgraph Hardware [하드웨어 / 에뮬레이터]
        Pico[Raspberry Pi Pico 2 W<br/>CircuitPython 9.x HTTP Server]
        MockServer[Node.js Mock Server<br/>firmware/mock_pico_server.js]
    end

    Store <--> IIoTAdapter
    CPAdapter <--> Proxy
    Proxy <-->|Wi-Fi HTTP| Pico
    Proxy <-->|Localhost:5050| MockServer
```

---

## 🔌 4대 레퍼런스 하드웨어 핀맵

| 부품명 | Pico 2 W 핀 | 통신 규격 | 역할 및 3D 동기화 |
| :--- | :--- | :--- | :--- |
| **DHT11** | `GP15` | Digital (1-Wire) | 실내 온도(℃) 및 습도(%) 계측 -> 3D 플로팅 배지 |
| **Cds 센서** | `GP26` (ADC0) | 16-bit Analog ADC | 실내 조도 계측 -> 3D 방 환경광(Ambient Light) 밝기 자동 연동 |
| **SG90** | `GP16` | 50Hz PWM 서보 | 스마트 도어 개폐 (0°~90°) -> 3D 도어 부드러운 회전 |
| **RGB LED** | `GP18, GP19, GP20` | PWM 출력 (1kHz) | 거실 천장 펜던트 조명 -> 3D 조명 색상 동적 발광 |

---

## 🚀 빠른 시작 가이드 (Quick Start)

### 1. 패키지 설치 및 개발 서버 구동
```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 개발 서버 실행 (포트: 3001)
npm run dev
```

브라우저에서 [http://localhost:3001](http://localhost:3001)에 접속합니다.  
기본값으로 **시뮬레이션 모드**가 활성화되어 있어 하드웨어 연결 없이 즉시 모든 3D 씬과 위젯을 조작할 수 있습니다.

---

## 🧪 하드웨어 연동 및 모의(Mock) 테스트

### 방법 A: 실물 Pico 2 W 보드 없이 모의 테스트 (교실/실습실 권장)
1. 별도의 터미널 창에서 모의 하드웨어 서버를 실행합니다:
   ```bash
   node firmware/mock_pico_server.js
   ```
2. 대시보드 상단 **[Pico 2 W 연결 설정]** 버튼을 클릭합니다.
3. IP 주소 입력창에 `127.0.0.1:5050`을 입력하고 **[하드웨어 연동]** 모드를 선택합니다.
4. 상단 뱃지가 녹색(`Pico 2 W`)으로 변경되며 실제 하드웨어와 100% 동일하게 센서 텔레메트리 수신 및 서보모터/LED 제어가 동작합니다.

### 방법 B: 실제 Raspberry Pi Pico 2 W 연결
1. Pico 2 W의 BOOTSEL 버튼을 누른 채 PC에 연결하여 `CIRCUITPY` 드라이브를 엽니다.
2. `firmware/circuitpython/` 폴더 안의 `code.py`와 `settings.toml`을 복사합니다.
3. `settings.toml`에 접속할 공유기 정보(SSID, PASSWORD)를 입력합니다:
   ```toml
   CIRCUITPY_WIFI_SSID = "your_wifi_name"
   CIRCUITPY_WIFI_PASSWORD = "your_wifi_password"
   ```
4. Pico 2 W가 부팅된 후 시리얼 모니터에 출력되는 IP 주소(예: `192.168.0.50`)를 대시보드 설정 모달에 입력합니다.

---

## 🤖 생성형 AI 바이브 코딩 5단계 프로토콜

학생들이 프로젝트 주제(스마트팜, 스마트팩토리, 스마트빌딩 등)를 변경할 때, 생성형 AI(ChatGPT, Claude, Gemini, Cursor)에게 [`context/PLATFORM_FULL_CONTEXT.md`](context/PLATFORM_FULL_CONTEXT.md) 전문을 입력한 후 아래 5단계 순서로 요청합니다:

```text
[Step 1] CircuitPython 펌웨어 확장 (firmware/circuitpython/code.py)
   └── 주제에 맞는 신규 센서/액추에이터 핀 초기화 및 /api/status JSON 반환값 정의

[Step 2] 타입 시스템 정의 (src/core/types/iot.ts)
   └── 신규 센서/액추에이터 인터페이스 및 Zustand 스토어 업데이트 액션 추가

[Step 3] 시뮬레이터 난수 갱신 (src/core/adapter/MockIoTAdapter.ts)
   └── 하드웨어 부재 시에도 동작할 자연스러운 실시간 변동 난수 로직 추가

[Step 4] 3D 가상 공간 씬 구현 (src/components/3d/)
   └── 주제에 어울리는 새로운 3D 룸 컴포넌트(예: SmartFarmRoom.tsx) 제작 및 SceneCanvas 연동

[Step 5] UI 위젯 및 모달 커스터마이징 (src/components/ui/)
   └── SensorOutputPanel 게이지/CSV 컬럼 추가 및 DeviceManageModal 핀맵 반영
```

---

## 📚 대시보드 실전 매뉴얼 안내

프로젝트 내부에는 학생과 교사를 위한 인터랙티브 웹 가이드북이 탑재되어 있습니다:
- **온라인 접속**: [http://localhost:3001/manual.html](http://localhost:3001/manual.html)
- **주요 내용**:
  - ⭐ **0. 플랫폼 마스터 컨텍스트 원클릭 복사** (AI 프롬프트 주입용)
  - 1. 플랫폼 및 스마트홈 베이스라인 개요
  - 2. 하드웨어 결선 & CircuitPython 세팅 및 Node.js Mock 서버 테스트
  - 3. Context 엔지니어링의 원리 (왜 AI가 엉뚱한 코드를 짜는가?)
  - 4. 팀별 주제 변경 실전 레시피 (스마트팜, 스마트팩토리, 스마트보안)
  - 5. 대시보드 UI 기능 구현 & 3D z-index 레이어링 가이드
  - ⭐ 6. **[학생 실습] 팀별 Context 문장 작성 가이드 & 주제별 Context 예시문 6선**
  - 7. **실전 완성형 프롬프트 12선 (원클릭 풀 Context 복사)**
  - 8. 트러블슈팅 & FAQ

---

## 🛠️ 디버깅 & 트러블슈팅 가이드

| 상황 | 원인 | 해결책 |
| :--- | :--- | :--- |
| **3D 메시지가 모달 창을 가림** | Drei `<Html>`의 기본 z-index가 1600만 이상으로 책정됨 | `zIndexRange={[10, 0]}` 속성 부여, 모달 `z-[100]` 격상, 상위 `isModalOpen` 감지 시 3D 어노테이션 즉시 언마운트 |
| **잘못된 IP 입력 시 무한 로딩** | `CircuitPythonAdapter`가 `connecting` 상태에서 에러 전이를 누락함 | `store.connectionState !== 'error'` 조건으로 즉시 에러 상태로 전이하여 무한 대기 차단 및 올바른 IP 재입력 시 자동 복구 |
| **하드웨어 분리 시 센서 멈춤** | 하드웨어 모드에서 stale 체크 루프 누락 | 어댑터 내부 5초 주기 `staleCheckInterval`을 통해 10초 이상 미수신 센서를 '오프라인'으로 판정 |
| **브라우저 CORS 에러** | 브라우저에서 외부 IP로 직접 fetch 호출 시 차단됨 | `src/app/api/pico/[...path]/route.ts` 서버사이드 프록시 라우트를 경유하여 CORS 원천 차단 |
| **학교 Wi-Fi 통신 차단** | 공유기 내 기기간 통신 차단(AP 격리 환경) | `node firmware/mock_pico_server.js`로 모의 테스트하거나, 스마트폰 핫스팟에 PC와 Pico를 동시 연결 |

---

## 📄 라이선스
본 프로젝트는 교육 및 비상업적 연구 목적으로 자유롭게 사용, 수정, 배포할 수 있습니다.
