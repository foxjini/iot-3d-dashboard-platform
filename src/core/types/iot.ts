export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'error';
export type PlatformMode = 'simulation' | 'hardware';

export interface SensorData {
  deviceId: string;
  name: string;
  value: number;
  unit: string;
  updatedAt: number;     // ms timestamp
  isStale: boolean;       // true if not updated for > 10s
  minWarning?: number;
  maxWarning?: number;
}

export interface ServoActuatorData {
  deviceId: string;
  name: string;
  targetAngle: number;    // 0 ~ 180 degrees
  reportedAngle: number;  // 0 ~ 180 degrees
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

export interface LogEntry {
  id: string;
  timestamp: number;
  type: 'info' | 'success' | 'warn' | 'error';
  message: string;
  source: 'SYSTEM' | 'MOCK' | 'PICO_2W' | 'USER';
}

export interface IoTPlatformState {
  mode: PlatformMode;
  connectionState: ConnectionState;
  picoIpAddress: string;
  selectedDeviceId: string | null;
  isExhibitionMode: boolean;
  isAutoRotate: boolean;

  // Sensors
  sensors: {
    dht11_temp: SensorData;
    dht11_humi: SensorData;
    cds_light: SensorData;
  };

  // Actuators
  actuators: {
    sg90_door: ServoActuatorData;
    rgb_light: RgbActuatorData;
  };

  // System Logs
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
