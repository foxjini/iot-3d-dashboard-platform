/**
 * Raspberry Pi Pico 2 W (CircuitPython 9.x/10.x) Mock REST Server
 * 
 * [목적]
 * 실제 Pico 2 W 하드웨어가 없거나 Wi-Fi 연결 환경이 제한된 교실/실습실 환경에서
 * 하드웨어 연동 모드를 100% 동일하게 모의 테스트하고 디버깅할 수 있는 에뮬레이터 서버입니다.
 * 
 * [실행 방법]
 * node firmware/mock_pico_server.js
 * (포트: 5050 -> 대시보드 IP 입력창에 127.0.0.1:5050 입력)
 */

const http = require('http');

const PORT = process.env.PORT || 5050;

// 모의 하드웨어 상태
let hardwareState = {
  servoAngle: 0,
  rgbColor: '#60A5FA',
  rgbState: 'ON',
  temperature: 24.5,
  humidity: 48.0,
  lightRaw: 32000
};

// 1.5초마다 온습도 및 조도 센서값의 자연스러운 변동 시뮬레이션
setInterval(() => {
  hardwareState.temperature = Math.round((hardwareState.temperature + (Math.random() - 0.49) * 0.3) * 10) / 10;
  hardwareState.humidity = Math.round((hardwareState.humidity + (Math.random() - 0.49) * 0.5) * 10) / 10;
  hardwareState.lightRaw = Math.min(64000, Math.max(10000, hardwareState.lightRaw + Math.floor((Math.random() - 0.5) * 800)));
}, 1500);

let requestCount = 0;

const server = http.createServer((req, res) => {
  requestCount++;

  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url;

  // 1. 센서 텔레메트리 조회 (GET /api/status)
  if (req.method === 'GET' && url.startsWith('/api/status')) {
    const responsePayload = {
      temperature: hardwareState.temperature,
      humidity: hardwareState.humidity,
      light_adc: hardwareState.lightRaw,
      light_raw: hardwareState.lightRaw,
      servo_angle: hardwareState.servoAngle,
      rgb_color: hardwareState.rgbColor,
      rgb_state: hardwareState.rgbState,
      uptime: process.uptime()
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(responsePayload));
    return;
  }

  // 2. SG90 서보모터 제어 (POST /api/servo)
  if (req.method === 'POST' && url.startsWith('/api/servo')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (typeof parsed.angle === 'number') {
          hardwareState.servoAngle = parsed.angle;
          console.log(`>>> [Mock Pico] SG90 서보모터 회전 실행: ${parsed.angle}°`);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', angle: hardwareState.servoAngle }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });
    return;
  }

  // 3. RGB LED 조명 제어 (POST /api/rgb)
  if (req.method === 'POST' && url.startsWith('/api/rgb')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (parsed.color) hardwareState.rgbColor = parsed.color;
        if (parsed.state) hardwareState.rgbState = parsed.state;
        console.log(`>>> [Mock Pico] RGB LED 제어 실행: ${hardwareState.rgbColor} [${hardwareState.rgbState}]`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'ok', 
          color: hardwareState.rgbColor, 
          state: hardwareState.rgbState 
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });
    return;
  }

  // 404 처리
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found', url }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('=======================================================');
  console.log(`[Mock Pico 2 W Server] Started on http://127.0.0.1:${PORT}`);
  console.log(`CircuitPython 9.x REST Server Emulation Ready`);
  console.log('=======================================================');
});
