# PLATFORM_FULL_CONTEXT: 3D IoT 대시보드 플랫폼 전체 마스터 컨텍스트

이 문서는 학생 팀 프로젝트용 "스마트홈 3D IoT 공통 개발 플랫폼"의 전체 아키텍처, 데이터 흐름, 핵심 파일 코드 및 확장 규칙을 단 하나의 문서로 집약한 **AI 마스터 지식 베이스(Master Knowledge Base)**입니다.

생성형 AI(ChatGPT, Claude, Gemini, Cursor 등)에게 이 문서 전문을 입력하면, AI가 프로젝트 전체 구조를 100% 파악하여 환각 없이 완벽하게 작동하는 코드를 생성할 수 있습니다.

---

## 1. 프로젝트 개요 및 기술 스택
- **프론트엔드**: Next.js 14 LTS (App Router) + React 18 + TypeScript + TailwindCSS + Lucide Icons
- **3D 그래픽**: Three.js + React Three Fiber (`@react-three/fiber` v8) + Drei (`@react-three/drei` v9) (`ssr: false` 클라이언트 전용)
- **상태 관리**: Zustand (`src/core/store/useIoTStore.ts`) - 단일 진실 공급원(Single Source of Truth)
- **마이크로컨트롤러**: Raspberry Pi Pico 2 W (RP2350 기반, Wi-Fi 탑재)
- **임베디드 펌웨어**: CircuitPython 9.x / 10.x (`adafruit_httpserver` 기반 CORS 지원 REST API)
- **운영 모드**:
  1. `simulation` (기본값): 하드웨어 없이 브라우저 내에서 가상 센서/액추에이터 100% 동작
  2. `hardware`: Wi-Fi를 통해 실제 Pico 2 W와 양방향 REST 통신

---

## 2. 전체 파일 구조 및 역할 분담 (Change Boundary)

```text
3D_IoT_Dashboard_Platform/
├── firmware/
│   ├── mock_pico_server.js     # [★신규 도구] 실물 보드 없이 하드웨어 모드를 100% 테스트하는 Node.js 에뮬레이터
│   └── circuitpython/
│       ├── code.py             # [★수정 대상] Pico 2 W CircuitPython 메인 펌웨어
│       ├── settings.toml       # Wi-Fi SSID / PASSWORD
│       └── README.md
│
├── src/
│   ├── core/
│   │   ├── types/iot.ts        # [★수정 대상] 센서, 액추에이터, 스토어 타입 정의
│   │   ├── store/useIoTStore.ts# [기반 파일] 2-Phase Acknowledgment, 로그, 상태 관리
│   │   └── adapter/
│   │       ├── IIoTAdapter.ts  # [기반 파일] 어댑터 인터페이스
│   │       ├── MockIoTAdapter.ts # [★수정 대상] 가상 센서 난수 발생기
│   │       └── CircuitPythonAdapter.ts # [기반 파일] Pico 2 W HTTP 통신기 (에러 핸들링 및 Stale 감지)
│   │
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── SceneCanvas.tsx   # [기반 파일] R3F Canvas 래퍼 (조도 동적 연동, 모달 감지 isModalOpen 전달)
│   │   │   ├── SmartHomeRoom.tsx # [★수정 대상] 3D 가상 공간 룸 메쉬 (방/온실/공장)
│   │   │   ├── NeedsYouCallout3D.tsx # [신규/개선] 3D 플로팅 말풍선 (z-index 제어, 4.5초 자동소멸, 닫기 버튼)
│   │   │   ├── DoorObject.tsx    # 서보모터 연동 도어 메쉬
│   │   │   ├── LightObject.tsx   # RGB LED 연동 조명 메쉬
│   │   │   ├── DhtSensorBadge.tsx# DHT11 온습도 3D 플로팅 배지
│   │   │   ├── CdsSensorNode.tsx # Cds 조도 센서 메쉬
│   │   │   └── CameraRig.tsx     # 카메라 컨트롤러
│   │   │
│   │   └── ui/
│   │       ├── NavRail.tsx           # 좌측 최외곽 기능 네비게이션 레일 (텔레메트리/스케줄/장치관리/매뉴얼)
│   │       ├── RoomsSidebar.tsx      # 공간 목록 사이드바 및 모달 런처 (+ 새 공간 추가, 장치 관리, 자동화 스케줄)
│   │       ├── CenterHeader.tsx      # 중앙 상단 공간 탭, 센서 새로고침, 카메라 리셋, 단축키 툴팁
│   │       ├── InspectorPanel.tsx    # 우측 3단 멀티탭 인스펙터 (장치 제어 / 센서 출력 / 제어 로그)
│   │       ├── SensorOutputPanel.tsx # [신규] 실시간 센서 게이지, Raw ADC 스트림, CSV 내보내기 패널
│   │       ├── ControlLogPanel.tsx   # [신규] 카테고리별(하드웨어/사용자/시뮬레이터/시스템) 실시간 제어 로그 스트림
│   │       ├── DeviceManageModal.tsx # [신규] 4대 핀아웃(GP15, GP16, GP18~20, GP26) 상태 점검 및 테스트 모달 (z-[100])
│   │       ├── ScheduleModal.tsx     # [신규] 5대 이벤트 구동 자동화 규칙 토글 모달 (z-[100])
│   │       ├── AddRoomModal.tsx      # [신규] 팀별 프로젝트 새 가상 공간 추가 모달 (z-[100])
│   │       ├── ReviewModal.tsx       # [신규] 3D 이상치 감지 시 승인 대기 검토 모달 (z-[100])
│   │       ├── PicoIpModal.tsx       # [신규] Pico 2 W IP 주소 및 하드웨어 모드 설정 모달 (z-[100])
│   │       └── PromptBar.tsx         # [신규] 지능형 한국어 자연어 명령 파서 및 퀵 액션 칩
│   │
│   └── app/
│       ├── api/pico/[...path]/route.ts # [신규] 브라우저 CORS 회피 및 IP 정규화 프록시 라우트
│       ├── layout.tsx            # 루트 레이아웃 & IoTProvider
│       ├── page.tsx              # 스마트홈 3D 통합 관제 대시보드 메인 페이지
│       └── 2d/page.tsx           # 2D 클래식 대시보드
```

> **📌 규칙:** 학생들이 팀별 주제(스마트팜, 스마트팩토리 등)를 바꿀 때 수정하는 파일은 주로 다음 **4개 핵심 파일**입니다:
> 1. `firmware/circuitpython/code.py`
> 2. `src/core/types/iot.ts`
> 3. `src/core/adapter/MockIoTAdapter.ts`
> 4. `src/components/3d/SmartHomeRoom.tsx` (또는 신규 씬 컴포넌트) + `src/components/ui/InspectorPanel.tsx` 또는 `SensorOutputPanel.tsx`

---

## 3. 핵심 파일 1: 도메인 타입 정의 (`src/core/types/iot.ts`) 전문

```typescript
export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'error';
export type PlatformMode = 'simulation' | 'hardware';

export interface SensorData {
  deviceId: string;
  name: string;
  value: number;
  unit: string;
  updatedAt: number;     // ms timestamp
  isStale: boolean;       // 10초 이상 미수신 시 true
  minWarning?: number;
  maxWarning?: number;
}

export interface ServoActuatorData {
  deviceId: string;
  name: string;
  targetAngle: number;    // 0 ~ 180도
  reportedAngle: number;  // 0 ~ 180도
  pending: boolean;
  lastCommandAt?: number;
  errorMessage?: string;
}

export interface RgbActuatorData {
  deviceId: string;
  name: string;
  targetColor: string;    // Hex code, e.g. "#FF5500"
  reportedColor: string;
  targetState: 'ON' | 'OFF';
  reportedState: 'ON' | 'OFF';
  pending: boolean;
  lastCommandAt?: number;
  errorMessage?: string;
}

export interface IoTPlatformState {
  mode: PlatformMode;
  connectionState: ConnectionState;
  picoIpAddress: string;
  selectedDeviceId: string | null;
  isExhibitionMode: boolean;
  isAutoRotate: boolean;

  sensors: {
    dht11_temp: SensorData;
    dht11_humi: SensorData;
    cds_light: SensorData;
  };

  actuators: {
    sg90_door: ServoActuatorData;
    rgb_light: RgbActuatorData;
  };

  logs: LogEntry[];

  // Actions
  setMode: (mode: PlatformMode) => void;
  setPicoIpAddress: (ip: string) => void;
  setConnectionState: (state: ConnectionState) => void;
  setSelectedDevice: (deviceId: string | null) => void;
  setExhibitionMode: (enabled: boolean) => void;
  setAutoRotate: (enabled: boolean) => void;

  updateSensor: (id: 'dht11_temp' | 'dht11_humi' | 'cds_light', value: number) => void;
  setServoAngle: (angle: number) => Promise<boolean>;
  setRgbColor: (color: string) => Promise<boolean>;
  setRgbState: (state: 'ON' | 'OFF') => Promise<boolean>;

  confirmServoAck: (angle: number) => void;
  confirmRgbAck: (color: string, state: 'ON' | 'OFF') => void;
  failCommand: (actuatorId: 'sg90_door' | 'rgb_light', errorMessage: string) => void;
  addLog: (type: LogEntry['type'], message: string, source?: LogEntry['source']) => void;
  clearLogs: () => void;
  checkStaleSensors: () => void;
}
```

---

## 4. 핵심 파일 2: 상태 관리 스토어 (`src/core/store/useIoTStore.ts`) 동작 규칙

- 스토어는 **2-Phase 제어**를 구현합니다:
  - UI에서 `setServoAngle(90)` 호출 시, `pending = true`가 되며 버튼이 비활성화됩니다.
  - 어댑터가 하드웨어 또는 시뮬레이터로부터 성공 응답을 받으면 `confirmServoAck(90)`을 호출하여 `reportedAngle = 90`, `pending = false`로 확정됩니다.
  - 센서 갱신은 `updateSensor(id, value)`를 호출하면 `updatedAt = Date.now()`와 함께 즉시 3D 배지와 UI에 반영됩니다.

---

## 5. 핵심 파일 3: CircuitPython 메인 펌웨어 (`firmware/circuitpython/code.py`) 전문

```python
import os, time, board, analogio, pwmio, wifi, socketpool
from adafruit_motor import servo
import adafruit_dht
from adafruit_httpserver import Server, Request, Response, JSONResponse, POST, GET, OPTIONS

# 1. 핀 할당
dht = adafruit_dht.DHT11(board.GP15)
cds = analogio.AnalogIn(board.GP26)
servo_pwm = pwmio.PWMOut(board.GP16, duty_cycle=2 ** 15, frequency=50)
my_servo = servo.Servo(servo_pwm, min_pulse=500, max_pulse=2400)
current_servo_angle = 0
my_servo.angle = current_servo_angle

red_pwm = pwmio.PWMOut(board.GP18, frequency=1000)
green_pwm = pwmio.PWMOut(board.GP19, frequency=1000)
blue_pwm = pwmio.PWMOut(board.GP20, frequency=1000)
current_rgb_color = "#3B82F6"
current_rgb_state = "ON"

def apply_rgb(hex_code, state):
    global current_rgb_color, current_rgb_state
    current_rgb_color = hex_code
    current_rgb_state = state
    if state == "OFF":
        red_pwm.duty_cycle = green_pwm.duty_cycle = blue_pwm.duty_cycle = 0
        return
    clean = hex_code.lstrip("#")
    if len(clean) == 6:
        r = int(clean[0:2], 16) / 255.0
        g = int(clean[2:4], 16) / 255.0
        b = int(clean[4:6], 16) / 255.0
        red_pwm.duty_cycle = int(r * 65535)
        green_pwm.duty_cycle = int(g * 65535)
        blue_pwm.duty_cycle = int(b * 65535)

# 2. Wi-Fi 및 HTTP 서버
wifi.radio.connect(os.getenv("CIRCUITPY_WIFI_SSID"), os.getenv("CIRCUITPY_WIFI_PASSWORD"))
pool = socketpool.SocketPool(wifi.radio)
server = Server(pool, "/static", debug=True)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

@server.route("/api/status", [GET, OPTIONS])
def handle_status(request: Request):
    if request.method == "OPTIONS": return Response(request, headers=CORS_HEADERS)
    temp = humi = 0
    try: temp, humi = dht.temperature or 24.0, dht.humidity or 50.0
    except: temp, humi = 24.0, 50.0
    return JSONResponse(request, {
        "status": "online", "temperature": temp, "humidity": humi,
        "light_adc": cds.value, "servo_angle": current_servo_angle,
        "rgb_color": current_rgb_color, "rgb_state": current_rgb_state
    }, headers=CORS_HEADERS)

@server.route("/api/servo", [POST, OPTIONS])
def handle_servo(request: Request):
    global current_servo_angle
    if request.method == "OPTIONS": return Response(request, headers=CORS_HEADERS)
    body = request.json()
    angle = max(0, min(180, int(body.get("angle", 0))))
    my_servo.angle = angle
    current_servo_angle = angle
    return JSONResponse(request, {"success": True, "servo_angle": angle}, headers=CORS_HEADERS)

@server.route("/api/rgb", [POST, OPTIONS])
def handle_rgb(request: Request):
    if request.method == "OPTIONS": return Response(request, headers=CORS_HEADERS)
    body = request.json()
    apply_rgb(body.get("color", current_rgb_color), body.get("state", current_rgb_state))
    return JSONResponse(request, {"success": True, "color": current_rgb_color, "state": current_rgb_state}, headers=CORS_HEADERS)

server.start(str(wifi.radio.ipv4_address), port=80)
while True:
    server.poll()
    time.sleep(0.01)
```

---

## 6. 핵심 파일 4: 시뮬레이터 (`src/core/adapter/MockIoTAdapter.ts`) 전문

```typescript
import { IIoTAdapter } from './IIoTAdapter';
import { useIoTStore } from '../store/useIoTStore';

export class MockIoTAdapter implements IIoTAdapter {
  private sensorInterval: NodeJS.Timeout | null = null;
  private staleCheckInterval: NodeJS.Timeout | null = null;

  init(): void {
    const store = useIoTStore.getState();
    store.setConnectionState('connected');

    this.sensorInterval = setInterval(() => {
      if (useIoTStore.getState().mode !== 'simulation') return;
      const s = useIoTStore.getState().sensors;
      // 난수 변동
      const newTemp = Math.round(Math.min(32, Math.max(18, s.dht11_temp.value + (Math.random() - 0.48) * 0.4)) * 10) / 10;
      const newHumi = Math.round(Math.min(75, Math.max(30, s.dht11_humi.value + (Math.random() - 0.49) * 0.8)) * 10) / 10;
      const newLight = Math.min(62000, Math.max(15000, s.cds_light.value + Math.floor((Math.random() - 0.5) * 1200)));

      useIoTStore.getState().updateSensor('dht11_temp', newTemp);
      useIoTStore.getState().updateSensor('dht11_humi', newHumi);
      useIoTStore.getState().updateSensor('cds_light', newLight);
    }, 2000);

    this.staleCheckInterval = setInterval(() => {
      useIoTStore.getState().checkStaleSensors();
    }, 5000);
  }

  destroy(): void {
    if (this.sensorInterval) clearInterval(this.sensorInterval);
    if (this.staleCheckInterval) clearInterval(this.staleCheckInterval);
  }

  async sendServoCommand(angle: number): Promise<boolean> {
    const store = useIoTStore.getState();
    return new Promise((resolve) => {
      setTimeout(() => {
        store.confirmServoAck(angle);
        resolve(true);
      }, 350);
    });
  }

  async sendRgbCommand(color: string, state: 'ON' | 'OFF'): Promise<boolean> {
    const store = useIoTStore.getState();
    return new Promise((resolve) => {
      setTimeout(() => {
        store.confirmRgbAck(color, state);
        resolve(true);
      }, 200);
    });
  }
}
```

---

## 7. 새 주제(예: 스마트팜) 변경 시 따라야 할 4단계 표준 프로토콜

1. **Step 1 (CircuitPython 펌웨어)**:
   - `firmware/circuitpython/code.py`에서 불필요한 센서를 제거하고 새 센서(예: 토양수분 `board.GP27`)를 초기화한 후, `/api/status` 반환 JSON에 필드를 추가합니다.
2. **Step 2 (프론트엔드 타입 정의)**:
   - `src/core/types/iot.ts`의 `sensors` 객체에 새 센서 ID(`soil_moisture` 등)를 추가하고, `updateSensor` 액션의 허용 ID 유니온 타입에 등록합니다.
3. **Step 3 (시뮬레이터 난수 갱신)**:
   - `src/core/adapter/MockIoTAdapter.ts`의 `setInterval` 내부에 새 센서의 자연스러운 변동 난수 계산식을 추가하고 `updateSensor(...)`를 호출합니다.
4. **Step 4 (3D 가상 공간 및 UI 연동)**:
   - `src/components/3d/`에 새 씬 컴포넌트(예: `SmartFarmRoom.tsx`)를 생성하고, `SmartHomeRoom.tsx`를 교체합니다.
   - `src/components/ui/SensorOutputPanel.tsx` 및 `InspectorPanel.tsx`에서 새 센서 수치를 표시하는 게이지 및 제어 위젯을 추가합니다.

---

## 8. 핵심 엔지니어링 원칙: 3D 레이어링 & 하드웨어 에러 제어

### [1. Drei `<Html>` Z-Index 간섭 방지 및 Auto-Dismiss 패턴]
- Three.js 씬 내부에 2D UI(말풍선, 배지 등)를 띄울 때는 `@react-three/drei`의 `<Html>`을 사용합니다.
- `<Html>`은 기본적으로 `z-index`를 1,600만 대의 매우 큰 값으로 부여하므로, 일반적인 CSS 모달(`z-50`)이 가려지는 문제가 발생합니다.
- **해결 공식**:
  1. `<Html zIndexRange={[10, 0]}>`로 3D 오버레이의 최대 z-index를 10 이하로 제한합니다.
  2. 모달 컨테이너의 z-index를 `z-[100]` 이상으로 설정합니다.
  3. 모달 열림 플래그(`isModalOpen`)를 3D 컴포넌트에 prop으로 전달하여 모달 활성화 시 말풍선을 즉시 `null`로 언마운트합니다.
  4. '승인 완료'와 같은 일회성 알림은 `setTimeout(..., 4500)`으로 자동 소멸 처리하고 수동 `✕` 닫기 버튼을 반드시 제공합니다.

### [2. CircuitPython REST 연동 시 에러 머신 및 Stale 센서 감지]
- `CircuitPythonAdapter.ts`는 다음 원칙으로 네트워크 예외를 방어합니다:
  1. IP 주소 입력 시 `http://` 접두사와 끝 슬래시를 자동 제거 정규화합니다.
  2. 요청 실패 시 `store.connectionState !== 'error'` 조건으로 즉시 에러 상태로 전이하여 무한 대기(스피너 영구 고착)를 방지합니다.
  3. 5초 주기의 `staleCheckInterval`을 구동하여 10초 이상 미수신 센서를 즉시 오프라인(`isStale: true`)으로 처리합니다.
  4. 학교 실습실이나 오프라인 환경에서는 `node firmware/mock_pico_server.js`를 구동하여 100% 동일한 하드웨어 REST 통신을 모의 검증할 수 있습니다.

