# ==============================================================================
# CircuitPython 9.x/10.x Firmware for Raspberry Pi Pico 2 W
# Smart Home Reference Baseline: DHT11, Cds, SG90, RGB LED
# ==============================================================================
import os
import time
import board
import analogio
import pwmio
import wifi
import socketpool
from adafruit_motor import servo
import adafruit_dht
from adafruit_httpserver import Server, Request, Response, JSONResponse, POST, GET, OPTIONS

print(">>> Pico 2 W 스마트홈 CircuitPython 펌웨어 시작...")

# ------------------------------------------------------------------------------
# 1. 하드웨어 핀 및 객체 초기화
# ------------------------------------------------------------------------------
# 1.1 DHT11 온습도 센서 (GP15)
dht = adafruit_dht.DHT11(board.GP15)

# 1.2 Cds 조도 센서 (GP26 / ADC0)
cds = analogio.AnalogIn(board.GP26)

# 1.3 SG90 서보모터 (GP16 / 50Hz PWM)
servo_pwm = pwmio.PWMOut(board.GP16, duty_cycle=2 ** 15, frequency=50)
my_servo = servo.Servo(servo_pwm, min_pulse=500, max_pulse=2400)
current_servo_angle = 0
my_servo.angle = current_servo_angle

# 1.4 RGB LED (GP18-Red, GP19-Green, GP20-Blue / PWM)
red_pwm = pwmio.PWMOut(board.GP18, frequency=1000)
green_pwm = pwmio.PWMOut(board.GP19, frequency=1000)
blue_pwm = pwmio.PWMOut(board.GP20, frequency=1000)

current_rgb_color = "#3B82F6"  # 기본 블루
current_rgb_state = "ON"

def apply_rgb(hex_code, state):
    global current_rgb_color, current_rgb_state
    current_rgb_color = hex_code
    current_rgb_state = state

    if state == "OFF":
        red_pwm.duty_cycle = 0
        green_pwm.duty_cycle = 0
        blue_pwm.duty_cycle = 0
        return

    # Hex to RGB 16-bit (0 ~ 65535)
    clean_hex = hex_code.lstrip("#")
    if len(clean_hex) == 6:
        r = int(clean_hex[0:2], 16) / 255.0
        g = int(clean_hex[2:4], 16) / 255.0
        b = int(clean_hex[4:6], 16) / 255.0
        red_pwm.duty_cycle = int(r * 65535)
        green_pwm.duty_cycle = int(g * 65535)
        blue_pwm.duty_cycle = int(b * 65535)

apply_rgb(current_rgb_color, current_rgb_state)

# ------------------------------------------------------------------------------
# 2. Wi-Fi 연결 (settings.toml 참조)
# ------------------------------------------------------------------------------
ssid = os.getenv("CIRCUITPY_WIFI_SSID")
password = os.getenv("CIRCUITPY_WIFI_PASSWORD")

print(f"Wi-Fi 연결 시도 중: {ssid}...")
try:
    wifi.radio.connect(ssid, password)
    ip_addr = str(wifi.radio.ipv4_address)
    print(f"Wi-Fi 연결 성공! Pico 2 W IP: {ip_addr}")
except Exception as e:
    print(f"Wi-Fi 연결 실패: {e}. Standalone 모드로 대기합니다.")
    ip_addr = "0.0.0.0"

# ------------------------------------------------------------------------------
# 3. HTTP Server 및 REST API 라우트 (CORS 지원)
# ------------------------------------------------------------------------------
pool = socketpool.SocketPool(wifi.radio)
server = Server(pool, "/static", debug=True)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

@server.route("/api/status", [GET, OPTIONS])
def handle_status(request: Request):
    if request.method == "OPTIONS":
        return Response(request, headers=CORS_HEADERS)

    temp_val = 24.0
    humi_val = 50.0
    try:
        temp_val = dht.temperature or 24.0
        humi_val = dht.humidity or 50.0
    except RuntimeError:
        pass  # DHT11 간헐적 읽기 지연 무시

    data = {
        "status": "online",
        "temperature": temp_val,
        "humidity": humi_val,
        "light_adc": cds.value,
        "servo_angle": current_servo_angle,
        "rgb_color": current_rgb_color,
        "rgb_state": current_rgb_state,
        "ip": ip_addr,
    }
    return JSONResponse(request, data, headers=CORS_HEADERS)

@server.route("/api/servo", [POST, OPTIONS])
def handle_servo(request: Request):
    global current_servo_angle
    if request.method == "OPTIONS":
        return Response(request, headers=CORS_HEADERS)

    try:
        body = request.json()
        angle = int(body.get("angle", 0))
        angle = max(0, min(180, angle))
        my_servo.angle = angle
        current_servo_angle = angle
        return JSONResponse(request, {"success": True, "servo_angle": angle}, headers=CORS_HEADERS)
    except Exception as err:
        return JSONResponse(request, {"success": False, "error": str(err)}, headers=CORS_HEADERS)

@server.route("/api/rgb", [POST, OPTIONS])
def handle_rgb(request: Request):
    if request.method == "OPTIONS":
        return Response(request, headers=CORS_HEADERS)

    try:
        body = request.json()
        color = body.get("color", current_rgb_color)
        state = body.get("state", current_rgb_state)
        apply_rgb(color, state)
        return JSONResponse(request, {"success": True, "color": color, "state": state}, headers=CORS_HEADERS)
    except Exception as err:
        return JSONResponse(request, {"success": False, "error": str(err)}, headers=CORS_HEADERS)

# ------------------------------------------------------------------------------
# 4. 서버 시작 및 메인 루프
# ------------------------------------------------------------------------------
server.start(str(wifi.radio.ipv4_address), port=80)
print(f"HTTP Server 실행 중: http://{wifi.radio.ipv4_address}")

while True:
    try:
        server.poll()
    except Exception as err:
        print(f"Server poll error: {err}")
    time.sleep(0.01)
