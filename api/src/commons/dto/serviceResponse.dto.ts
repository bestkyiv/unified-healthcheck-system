export type ServiceResponseDto = {
  id: number;
  name: string;
  type: 'website' | 'telegramBot';
  urlOrIdentifier: string;
  isMonitored: boolean;
  status: 'up' | 'down' | 'pending';
  lastCheckedAt: Date | null;
  lastHeartbeatAt: Date | null;
};
