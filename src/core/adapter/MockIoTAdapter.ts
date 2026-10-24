import { IIoTAdapter } from './IIoTAdapter';
import { useIoTStore } from '../store/useIoTStore';

export class MockIoTAdapter implements IIoTAdapter {
  private sensorInterval: NodeJS.Timeout | null = null;
  private staleCheckInterval: NodeJS.Timeout | null = null;

  init(): void {
    const store = useIoTStore.getState();
    store.setConnectionState('connected');
    store.addLog('info', 'Mock IoT 시뮬레이터 연결됨 (가상 센서 활성화)', 'MOCK');

    // 2초마다 DHT11 온습도 및 조도 센서값 시뮬레이션
    this.sensorInterval = setInterval(() => {
      if (useIoTStore.getState().mode !== 'simulation') return;

      const currentTemp = useIoTStore.getState().sensors.dht11_temp.value;
      const currentHumi = useIoTStore.getState().sensors.dht11_humi.value;
      const currentLight = useIoTStore.getState().sensors.cds_light.value;

      // 자연스러운 변동 (Random Walk)
      const tempDelta = (Math.random() - 0.48) * 0.4;
      const humiDelta = (Math.random() - 0.49) * 0.8;
      const lightDelta = Math.floor((Math.random() - 0.5) * 1200);

      const newTemp = Math.round(Math.min(32, Math.max(18, currentTemp + tempDelta)) * 10) / 10;
      const newHumi = Math.round(Math.min(75, Math.max(30, currentHumi + humiDelta)) * 10) / 10;
      const newLight = Math.min(62000, Math.max(15000, currentLight + lightDelta));

      useIoTStore.getState().updateSensor('dht11_temp', newTemp);
      useIoTStore.getState().updateSensor('dht11_humi', newHumi);
      useIoTStore.getState().updateSensor('cds_light', newLight);
    }, 2000);

    // 5초마다 Stale 센서 체크
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
      }, 350); // 350ms 후 모터 회전 완료 시뮬레이션
    });
  }

  async sendRgbCommand(color: string, state: 'ON' | 'OFF'): Promise<boolean> {
    const store = useIoTStore.getState();
    return new Promise((resolve) => {
      setTimeout(() => {
        store.confirmRgbAck(color, state);
        resolve(true);
      }, 200); // 200ms 후 조명 갱신 완료
    });
  }
}
