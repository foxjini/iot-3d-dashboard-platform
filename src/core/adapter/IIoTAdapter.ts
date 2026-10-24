export interface IIoTAdapter {
  init(): void;
  destroy(): void;
  sendServoCommand(angle: number): Promise<boolean>;
  sendRgbCommand(color: string, state: 'ON' | 'OFF'): Promise<boolean>;
}
