# PROMPT_TEMPLATES: 학생들을 위한 바이브 코딩 실전 프롬프트 모음

> **💡 핵심 안내:**
> 생성형 AI(ChatGPT, Claude, Gemini 웹 등)는 현재 여러분 컴퓨터에 있는 프로젝트 파일 내용을 직접 읽을 수 없습니다!
> 따라서 단순히 "스마트팜으로 바꿔줘"라고만 하면 AI가 엉뚱한 코드를 만들어냅니다.
> 아래 프롬프트들은 **[시스템 규칙 + 현재 원본 코드 + 변경 요구사항]**이 하나로 결합된 **완전체 프롬프트(Self-Contained Prompt)**이므로, 전체를 복사해서 AI에 붙여넣기만 하면 100% 정상 작동하는 코드를 얻을 수 있습니다!

## ⭐ [학생 실습] 나만의 팀별 프로젝트 Context 문장 작성 가이드

### 1. 생성형 AI를 움직이는 '4단계 Context 구조 설계 공식'
1. **블록 1 (역할 & 플랫폼 선언)**: "당신은 Next.js 14 + R3F + Zustand + Raspberry Pi Pico 2 W(CircuitPython 9.x) 스마트홈 3D IoT 플랫폼 전문 개발자입니다. `PLATFORM_FULL_CONTEXT.md`를 기반으로 개발 중입니다."
2. **블록 2 (주제 & 하드웨어 핀맵)**: "우리 팀의 주제는 [_____]이며, 신규 센서 [센서명, GP핀, 측정값], 액추에이터 [SG90 서보모터 GP16 용도, RGB LED GP18~20 역할]을 사용합니다."
3. **블록 3 (3D 가상 공간 & UI 패널)**: "3D 공간은 [방 콘셉트, 설비/가구 메쉬]로 변경하고, 서보 각도에 따른 R3F 애니메이션을 연동하며, `SensorOutputPanel.tsx`에 게이지를 추가해주세요."
4. **블록 4 (파일 변경 경계)**: "Zustand 스토어(`useIoTStore.ts`) 규칙을 준수하며, `code.py`, `types/iot.ts`, `MockIoTAdapter.ts`, `3D 룸 컴포넌트` 4개 파일의 전체 완성 코드를 제공해주세요."

---

### 2. [빈칸 채우기] 우리 팀 맞춤형 Context 완성 템플릿
```markdown
당신은 Next.js 14 + R3F(Three.js) + Zustand + CircuitPython(Raspberry Pi Pico 2 W) 기반 스마트홈 3D IoT 플랫폼 전문 개발자입니다.
우리는 `PLATFORM_FULL_CONTEXT.md` 아키텍처를 기반으로 팀 프로젝트를 진행 중인 고등학생 팀입니다.

우리 팀 프로젝트 주제: [프로젝트 주제명 입력: 예: 스마트 펫케어 급식기 / 스마트 빗물 재활용 시스템 / 스마트 무인 도서관]

### [1. 우리 팀 하드웨어 핀맵 명세]
1. 신규 센서:
   - 센서명: [센서 이름 예: 초음파 거리 센서 / 토양 수분 센서 / 불꽃 감지 센서]
   - 핀 번호: [Pico 2 W 핀: 예: GP27 (ADC1)]
   - 측정 범위 및 단위: [예: 0~100cm / 0~100% / 정상·경보 0, 1]
2. 액추에이터 동작:
   - SG90 서보모터 (GP16): [서보모터가 움직일 역할 예: 사료 투출 밸브 0도->60도 / 환기 돔 개폐 0도->90도 / 차단봉 0도->90도]
   - RGB LED (GP18, GP19, GP20): [LED가 나타낼 상태 예: 녹색(정상), 노란색(동작 중), 빨간색(주의/경보)]
   - 기존 센서 활용: [Cds 조도 센서 GP26 / DHT11 온습도 GP15 중 유지할 항목]

### [2. 3D 가상 공간 및 대시보드 UI 연동 요구사항]
1. 3D 가상 공간 (R3F):
   - 공간 콘셉트: [예: 펫룸 / 농업 온실 / 도서관 열람실 / 공장 생산라인]
   - 배치할 3D 메쉬 오브젝트: [예: 사료통, 급수 그릇 / 스마트 베드 / 책상과 의자 / 컨베이어 벨트]
   - 서보모터 연동 R3F 애니메이션: [서보 각도 변화에 따라 3D 오브젝트가 회전하거나 열리는 동작]
2. 대시보드 UI 패널:
   - `SensorOutputPanel.tsx`에 신규 센서 게이지(값, 단위, 정상/주의 범위)를 추가해주세요.
   - CSV 파일 내보내기 시 신규 센서 계측 데이터 열을 포함해주세요.

### [3. 요청 파일 및 개발 규칙]
Zustand 단일 스토어(`useIoTStore.ts`)의 2-Phase Acknowledgment 규칙과 타입을 준수하며, 다음 4개 파일의 완성된 전체 코드를 작성해주세요:
1. `firmware/circuitpython/code.py`: 신규 센서 계측 및 `/api/status` JSON 반환, 서보/LED 제어
2. `src/core/types/iot.ts`: 신규 센서 데이터 인터페이스 및 updateSensor 유니온 타입 추가
3. `src/core/adapter/MockIoTAdapter.ts`: 하드웨어 부재 시에도 동작할 자연스러운 난수 시뮬레이터 로직
4. `src/components/3d/TeamCustomRoom.tsx`: 우리 팀 전용 3D 씬 컴포넌트 전체 코드
```

---

## [프롬프트 1] 스마트홈을 스마트팜(온실)으로 테마 변경하기 (Full Context 포함)

```markdown
당신은 Next.js 14 + React 18 + React Three Fiber (R3F) + Zustand + CircuitPython으로 구동되는 '스마트홈 3D IoT 공통 플랫폼'의 전문 개발자입니다.
우리는 이 플랫폼을 [스마트팜(Smart Farm)] 주제로 개조하려고 합니다.

### [1. 변경 목표]
1. 하드웨어/센서:
   - DHT11 온습도 센서 대신 [토양 수분 센서(Soil Moisture)]를 Pico 2 W의 GP27(ADC1) 핀에 추가합니다.
   - Cds 조도 센서(GP26)와 RGB LED(GP18,19,20 - 식물 성장 조명)는 그대로 유지합니다.
   - SG90 서보모터(GP16)는 방문 대신 '온실 상단 환기 돔 개폐기'로 용도를 변경합니다.
2. 3D 가상 공간:
   - 스마트홈 방 대신 흙 바닥과 투명 유리 프레임이 있는 '온실 돔'을 만들고 중앙에 식물 화분 배드를 배치합니다.
   - 서보모터 각도(0~180도)에 따라 온실 환기 돔 지붕이 부드럽게 열리고 닫히는 애니메이션을 연동합니다.

---

### [2. 현재 플랫폼의 원본 코드 참고 자료]

#### (A) 현재 Pico 2 W 펌웨어 (firmware/circuitpython/code.py 일부):
```python
import board, analogio, pwmio, wifi, socketpool
from adafruit_motor import servo
from adafruit_httpserver import Server, Request, JSONResponse, GET, POST, OPTIONS

cds = analogio.AnalogIn(board.GP26)
servo_pwm = pwmio.PWMOut(board.GP16, duty_cycle=2 ** 15, frequency=50)
my_servo = servo.Servo(servo_pwm)

@server.route("/api/status", [GET, OPTIONS])
def handle_status(request: Request):
    return JSONResponse(request, {
        "status": "online",
        "temperature": 24.0,
        "humidity": 50.0,
        "light_adc": cds.value,
        "servo_angle": current_servo_angle,
        "rgb_color": current_rgb_color,
        "rgb_state": current_rgb_state
    })
```

#### (B) 현재 센서/액추에이터 타입 (src/core/types/iot.ts 일부):
```typescript
export interface SensorData {
  deviceId: string;
  name: string;
  value: number;
  unit: string;
  updatedAt: number;
  isStale: boolean;
}

export interface IoTPlatformState {
  sensors: {
    dht11_temp: SensorData;
    dht11_humi: SensorData;
    cds_light: SensorData;
  };
  actuators: {
    sg90_door: ServoActuatorData;
    rgb_light: RgbActuatorData;
  };
}
```

#### (C) 현재 시뮬레이터 (src/core/adapter/MockIoTAdapter.ts 일부):
```typescript
// 2초마다 센서 난수 갱신
useIoTStore.getState().updateSensor('dht11_temp', newTemp);
useIoTStore.getState().updateSensor('dht11_humi', newHumi);
useIoTStore.getState().updateSensor('cds_light', newLight);
```

---

### [3. 요청 사항]
위 원본 코드를 기반으로, 학생들이 파일에 바로 덮어쓸 수 있도록 다음 4개 파일의 수정 코드를 명확한 파일 경로와 함께 단계별로 작성해주세요:
1. `firmware/circuitpython/code.py`: 토양수분(GP27) 측정 및 환기 돔 서보모터 제어 반영
2. `src/core/types/iot.ts`: `soil_moisture` 센서 및 스마트팜 액추에이터 타입 정의
3. `src/core/adapter/MockIoTAdapter.ts`: 토양수분(30%~80%) 변동 시뮬레이션 로직 추가
4. `src/components/3d/SmartFarmRoom.tsx`: 온실 돔, 화분 식물, 환기 돔 개폐 애니메이션 3D 컴포넌트 신규 작성 코드
```

---

## [프롬프트 2] 스마트팩토리(컨베이어 벨트 & 경고등)로 변경하기 (Full Context)

```markdown
당신은 Next.js 14 + R3F + CircuitPython 기반 스마트홈 플랫폼의 전문 개발자입니다.
우리는 이 플랫폼을 [스마트팩토리(Smart Factory)] 주제로 개조하려고 합니다.

### [1. 변경 목표]
1. 하드웨어:
   - Pico 2 W의 GP14 핀에 물품 감지용 센서를 추가하거나 Cds 조도 센서를 '생산 라인 통과 감지 센서'로 활용합니다.
   - 서보모터 SG90(GP16)은 컨베이어 벨트 위 불량품을 밀어내는 '스마트 푸셔(Pusher)' 암으로 역할을 바꿉니다.
   - RGB LED(GP18,19,20)는 공장 상태를 알리는 '3단 타워 램프'로 동작합니다 (초록: 정상 가동, 노랑: 대기, 빨강: 비상 정지).
2. 3D 공간:
   - 금속 질감의 컨베이어 벨트 메쉬를 만들고, 그 위에 작은 상자(물품)가 지나가며 서보모터 푸셔가 움직이는 애니메이션을 구현합니다.

### [2. 요청 사항]
기존 Zustand 스토어(`useIoTStore.ts`)와 R3F 씬 구조를 깨뜨리지 않으면서,
1. `src/components/3d/SmartFactoryRoom.tsx` (컨베이어 벨트 및 푸셔 암 3D 컴포넌트)
2. `firmware/circuitpython/code.py` (푸셔 제어 및 타워 램프 상태 코드)
를 학생들이 바로 복사해 넣을 수 있는 완성형 코드로 작성해주세요.
```

---

## [프롬프트 3] 새로운 초음파 거리 센서(HC-SR04) 추가하기 (Full Context)

```markdown
당신은 Pico 2 W + CircuitPython 및 Next.js IoT 플랫폼 개발자입니다.
Pico 2 W에 거리 측정을 위한 초음파 센서(HC-SR04)를 추가하고 웹 대시보드에 연동하려고 합니다.

- 회로 연결: Trig = board.GP14, Echo = board.GP13
- 2초마다 거리를 측정하여 cm 단위로 반환

현재 시스템의 code.py에는 `@server.route("/api/status")`가 구현되어 있고,
프론트엔드에는 `src/core/types/iot.ts`와 `MockIoTAdapter.ts`가 있습니다.

다음 작업의 구체적인 수정 코드를 파일별로 작성해주세요:
1. `firmware/circuitpython/code.py`: `adafruit_hcsr04.HCSR04`를 사용하여 거리를 측정하고 `/api/status` JSON에 `"distance_cm"` 필드 추가
2. `src/core/types/iot.ts`: `sensors.distance_cm` 타입 추가
3. `src/core/adapter/MockIoTAdapter.ts`: 10~150cm 사이의 거리 시뮬레이션 난수 생성
4. `src/components/ui/SensorOutputPanel.tsx`: 측정된 거리를 실시간 게이지 바로 표시하고 CSV 항목에 추가
```

---

## [프롬프트 4] 스마트 도어를 창문 블라인드로 변경하기 (Full Context)

```markdown
스마트홈 3D 씬의 `src/components/3d/DoorObject.tsx`를 창문 블라인드(`WindowBlindObject.tsx`)로 교체하고 싶습니다.
서보모터 reportedAngle(0° ~ 180°) 값에 따라:
- 0°일 때: 블라인드가 완전히 내려와 닫힌 상태
- 90°일 때: 블라인드 날개들이 수평으로 회전하여 햇빛이 들어오는 상태
- 180°일 때: 블라인드가 위로 완전히 올라간 상태
를 부드러운 Drei/R3F `useFrame` 애니메이션으로 구현한 완성된 `WindowBlindObject.tsx` 코드를 작성해주세요.
```

---

## [프롬프트 5] AI에게 코드 디버깅 및 에러 해결 요청하기

```markdown
우리는 Next.js 14 + React Three Fiber + Zustand 기반 IoT 플랫폼을 수정하고 있는 고등학생 팀입니다.
새로운 센서를 추가하는 도중 아래와 같은 에러가 발생했습니다:

[여기에 터미널 에러 메시지 또는 브라우저 콘솔 로그를 붙여넣으세요]

내가 수정한 파일의 코드는 다음과 같습니다:
[여기에 수정한 파일 내용 붙여넣기]

어느 부분에서 데이터 흐름(어댑터 -> 스토어 -> 컴포넌트)이 어긋났는지 원인을 짚어주고, 올바르게 수정한 파일 코드를 제시해주세요.
```
