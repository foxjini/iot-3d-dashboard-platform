import { IIoTAdapter } from './IIoTAdapter';
import { useIoTStore } from '../store/useIoTStore';

export class CircuitPythonAdapter implements IIoTAdapter {
  private pollInterval: NodeJS.Timeout | null = null;
  private staleCheckInterval: NodeJS.Timeout | null = null;
  private abortController: AbortController | null = null;

  init(): void {
    const store = useIoTStore.getState();
    const cleanIp = (store.picoIpAddress || '').replace(/^https?:\/\//i, '').replace(/\/+$/, '').trim();
    store.setConnectionState('connecting');
    store.addLog('info', `Pico 2 W (${cleanIp || 'IP 미지정'}) 연결 시도 중...`, 'PICO_2W');

    // 1.5초마다 Pico 2 W 상태 폴링
    this.pollInterval = setInterval(() => {
      if (useIoTStore.getState().mode !== 'hardware') return;
      this.fetchPicoStatus();
    }, 1500);

    // 5초마다 미수신 센서 stale 검사
    this.staleCheckInterval = setInterval(() => {
      useIoTStore.getState().checkStaleSensors();
    }, 5000);

    // 즉시 1회 호출
    this.fetchPicoStatus();
  }

  destroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
    if (this.staleCheckInterval) clearInterval(this.staleCheckInterval);
    if (this.abortController) this.abortController.abort();
  }

  private async fetchPicoStatus(): Promise<void> {
    const store = useIoTStore.getState();
    const rawIp = store.picoIpAddress;
    if (!rawIp) {
      if (store.connectionState !== 'disconnected') {
        store.setConnectionState('disconnected');
      }
      return;
    }
    const ip = rawIp.replace(/^https?:\/\//i, '').replace(/\/+$/, '').trim();

    try {
      this.abortController = new AbortController();
      const timeoutId = setTimeout(() => this.abortController?.abort(), 2000);

      // 1차 시도: 브라우저 직접 fetch (CORS 지원 Pico HTTP Server)
      let res: Response;
      try {
        res = await fetch(`http://${ip}/api/status`, {
          signal: this.abortController.signal,
          mode: 'cors',
        });
      } catch {
        // 2차 시도: Next.js 프록시 우회
        res = await fetch(`/api/pico/status?target=${encodeURIComponent(ip)}`, {
          signal: this.abortController.signal,
        });
      }

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();

      if (store.connectionState !== 'connected') {
        store.setConnectionState('connected');
        store.addLog('success', `Pico 2 W 연결 성공! (IP: ${ip})`, 'PICO_2W');
      }

      // 센서 데이터 갱신
      if (typeof data.temperature === 'number') store.updateSensor('dht11_temp', data.temperature);
      if (typeof data.humidity === 'number') store.updateSensor('dht11_humi', data.humidity);
      if (typeof data.light_adc === 'number') store.updateSensor('cds_light', data.light_adc);

      // 액추에이터 reported 상태 갱신 (pending이 아닐 때만)
      if (!store.actuators.sg90_door.pending && typeof data.servo_angle === 'number') {
        store.confirmServoAck(data.servo_angle);
      }
      if (!store.actuators.rgb_light.pending && data.rgb_color && data.rgb_state) {
        store.confirmRgbAck(data.rgb_color, data.rgb_state);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '통신 오류';
      if (store.connectionState !== 'error') {
        store.setConnectionState('error');
        store.addLog('warn', `Pico 2 W 연결 실패 또는 응답 없음 (${message})`, 'PICO_2W');
      }
    }
  }

  async sendServoCommand(angle: number): Promise<boolean> {
    const store = useIoTStore.getState();
    const rawIp = store.picoIpAddress;
    if (!rawIp) {
      store.failCommand('sg90_door', 'Pico 2 W IP 주소가 지정되지 않았습니다.');
      return false;
    }
    const ip = rawIp.replace(/^https?:\/\//i, '').replace(/\/+$/, '').trim();

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      let res: Response;
      try {
        res = await fetch(`http://${ip}/api/servo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ angle }),
          signal: controller.signal,
          mode: 'cors',
        });
      } catch {
        res = await fetch(`/api/pico/servo?target=${encodeURIComponent(ip)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ angle }),
          signal: controller.signal,
        });
      }

      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      store.confirmServoAck(angle);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '명령 전송 실패';
      store.failCommand('sg90_door', msg);
      return false;
    }
  }

  async sendRgbCommand(color: string, state: 'ON' | 'OFF'): Promise<boolean> {
    const store = useIoTStore.getState();
    const rawIp = store.picoIpAddress;
    if (!rawIp) {
      store.failCommand('rgb_light', 'Pico 2 W IP 주소가 지정되지 않았습니다.');
      return false;
    }
    const ip = rawIp.replace(/^https?:\/\//i, '').replace(/\/+$/, '').trim();

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      let res: Response;
      try {
        res = await fetch(`http://${ip}/api/rgb`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ color, state }),
          signal: controller.signal,
          mode: 'cors',
        });
      } catch {
        res = await fetch(`/api/pico/rgb?target=${encodeURIComponent(ip)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ color, state }),
          signal: controller.signal,
        });
      }

      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      store.confirmRgbAck(color, state);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '명령 전송 실패';
      store.failCommand('rgb_light', msg);
      return false;
    }
  }
}
