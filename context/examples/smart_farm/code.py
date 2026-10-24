# ==============================================================================
# CircuitPython 9.x/10.x Firmware for Pico 2 W - [스마트팜 Smart Farm 예시]
# 센서: 토양수분센서(GP27/ADC1), Cds 조도센서(GP26/ADC0)
# 액추에이터: 환기 돔 서보모터(GP16), 식물 성장 LED(GP18,19,20)
# ==============================================================================
import os
import time
import board
import analogio
import pwmio
import wifi
import socketpool
from adafruit_motor import servo
from adafruit_httpserver import Server, Request, Response, JSONResponse, POST, GET, OPTIONS

print(">>> Pico 2 W 스마트팜 펌웨어 시작...")

# 1. 센서
cds = analogio.AnalogIn(board.GP26)          # Cds 조도센서 (ADC0)
soil = analogio.AnalogIn(board.GP27)         # 토양 수분 센서 (ADC1 - 0: 건조 ~ 65535: 습윤)

# 2. 액추에이터
servo_pwm = pwmio.PWMOut(board.GP16, duty_cycle=2 ** 15, frequency=50)
dome_servo = servo.Servo(servo_pwm, min_pulse=500, max_pulse=2400)
current_dome_angle = 0
dome_servo.angle = current_dome_angle

red_pwm = pwmio.PWMOut(board.GP18, frequency=1000)
green_pwm = pwmio.PWMOut(board.GP19, frequency=1000)
blue_pwm = pwmio.PWMOut(board.GP20, frequency=1000)

current_rgb_color = "#10B981"  # 식물 성장 그린
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
    clean_hex = hex_code.lstrip("#")
    if len(clean_hex) == 6:
        r = int(clean_hex[0:2], 16) / 255.0
        g = int(clean_hex[2:4], 16) / 255.0
        b = int(clean_hex[4:6], 16) / 255.0
        red_pwm.duty_cycle = int(r * 65535)
        green_pwm.duty_cycle = int(g * 65535)
        blue_pwm.duty_cycle = int(b * 65535)

apply_rgb(current_rgb_color, current_rgb_state)

# 3. Wi-Fi
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
    if request.method == "OPTIONS":
        return Response(request, headers=CORS_HEADERS)

    # 토양수분 퍼센트 환산 (0 ~ 100%)
    soil_percent = round((soil.value / 65535) * 100, 1)

    return JSONResponse(request, {
        "status": "online",
        "soil_moisture": soil_percent,
        "light_adc": cds.value,
        "servo_angle": current_dome_angle,
        "rgb_color": current_rgb_color,
        "rgb_state": current_rgb_state,
    }, headers=CORS_HEADERS)

@server.route("/api/servo", [POST, OPTIONS])
def handle_servo(request: Request):
    global current_dome_angle
    if request.method == "OPTIONS":
        return Response(request, headers=CORS_HEADERS)
    body = request.json()
    angle = max(0, min(180, int(body.get("angle", 0))))
    dome_servo.angle = angle
    current_dome_angle = angle
    return JSONResponse(request, {"success": True, "servo_angle": angle}, headers=CORS_HEADERS)

@server.route("/api/rgb", [POST, OPTIONS])
def handle_rgb(request: Request):
    if request.method == "OPTIONS":
        return Response(request, headers=CORS_HEADERS)
    body = request.json()
    color = body.get("color", current_rgb_color)
    state = body.get("state", current_rgb_state)
    apply_rgb(color, state)
    return JSONResponse(request, {"success": True, "color": color, "state": state}, headers=CORS_HEADERS)

server.start(str(wifi.radio.ipv4_address), port=80)
print(f"스마트팜 서버 실행: http://{wifi.radio.ipv4_address}")

while True:
    try:
        server.poll()
    except Exception as e:
        pass
    time.sleep(0.01)
