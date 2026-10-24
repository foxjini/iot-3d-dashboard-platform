# CONTEXT_CIRCUITPYTHON_MAP: Pico 2 W 핀맵 & CircuitPython 규격

이 문서는 AI에게 Raspberry Pi Pico 2 W의 CircuitPython 펌웨어 및 하드웨어 결선 규칙을 제공하는 Context 문서입니다.

## 1. 하드웨어 기본 결선도 (스마트홈 레퍼런스)

| 장치명 | 부품 모델 | 핀 번호 (CircuitPython) | 신호 종류 | 설명 및 동작 원리 |
| :--- | :--- | :--- | :--- | :--- |
| **온습도 센서** | DHT11 | `board.GP15` | Digital I/O | `adafruit_dht.DHT11` 사용. 실내 온도(℃), 습도(%) 측정 (2초 주기 권장) |
| **조도 센서** | Cds | `board.GP26` (A0) | Analog In (ADC0) | `analogio.AnalogIn` 사용. 0~65535 값 반환. 10kΩ 저항과 전압분배 회로 구성 |
| **서보 모터** | SG90 | `board.GP16` | PWM (50Hz) | `adafruit_motor.servo.Servo` 사용. 0°(도어 닫힘) ~ 180°(도어 열림) 제어 |
| **RGB LED** | 4핀 공통 캐소드 | Red: `board.GP18`<br>Green: `board.GP19`<br>Blue: `board.GP20` | PWM (1kHz) | `pwmio.PWMOut` 3개 채널로 0~65535 듀티사이클 제어 (Hex 색상 변환) |

## 2. CircuitPython 파일 구조 (`CIRCUITPY` 드라이브)
- `code.py`: 부팅 시 자동 실행되는 메인 파이썬 스크립트
- `settings.toml`: Wi-Fi 접속 정보
  ```toml
  CIRCUITPY_WIFI_SSID = "your_wifi_name"
  CIRCUITPY_WIFI_PASSWORD = "your_wifi_password"
  ```
- `lib/`: 필수 라이브러리 폴더
  - `adafruit_dht.mpy`
  - `adafruit_motor/`
  - `adafruit_httpserver/`
  - `adafruit_requests.mpy`

## 3. REST API 규격 (`adafruit_httpserver`)
- 모든 응답에는 반드시 CORS 헤더(`Access-Control-Allow-Origin: *`)가 포함되어야 합니다.

### `GET /api/status`
현재 센서 수치 및 액추에이터 상태를 JSON으로 반환합니다.
```json
{
  "status": "online",
  "temperature": 24.5,
  "humidity": 45.0,
  "light_adc": 48200,
  "servo_angle": 90,
  "rgb_color": "#FF5500",
  "rgb_state": "ON"
}
```

### `POST /api/servo`
서보모터 각도를 설정합니다.
```json
// Request Body
{ "angle": 90 }
// Response
{ "success": true, "servo_angle": 90 }
```

### `POST /api/rgb`
RGB LED 색상 및 상태를 설정합니다.
```json
// Request Body
{ "color": "#00FF88", "state": "ON" }
// Response
{ "success": true, "color": "#00FF88", "state": "ON" }
```

## 4. 새 장치 추가 시 가이드 (AI 지원 규칙)
- 아날로그 센서(예: 토양수분센서, 수위센서)는 `board.GP27`(ADC1) 또는 `board.GP28`(ADC2)에 할당하세요.
- 디지털 센서(예: 초음파 HC-SR04, 인체감지 PIR)는 빈 GPIO(`GP14`, `GP17` 등)에 할당하세요.
- 액추에이터(릴레이, 버저 등)는 디지털 출력(`digitalio.DigitalInOut`) 또는 PWM으로 제어하세요.
