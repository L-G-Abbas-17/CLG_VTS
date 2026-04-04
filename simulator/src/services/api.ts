import axios from 'axios';

const DEVICE_SIMULATOR_URL_STORAGE_KEY = 'deviceSimulatorUrl';

export type TransportProtocol = 'mqtt' | 'tcp' | 'udp';

export type BridgeHealth = {
  ok: boolean;
  defaultProtocol: TransportProtocol;
  transports: {
    mqtt: {
      brokerUrl: string;
      connected: boolean;
    };
    tcp: {
      host: string;
      port: number;
    };
    udp: {
      host: string;
      port: number;
    };
  };
};

export type PublishTelemetryRequest = {
  protocol: TransportProtocol;
  payload: unknown;
  topic?: string;
  host?: string;
  port?: number;
};

// 🔥 FIXED FUNCTION
function defaultDeviceSimulatorUrl() {
  const envUrl = import.meta.env.VITE_DEVICE_SIMULATOR_URL;

  const saved = localStorage.getItem(DEVICE_SIMULATOR_URL_STORAGE_KEY);

  // Ignore localhost (old bad value)
  if (saved && saved.trim().length > 0 && !saved.includes('localhost')) {
    console.log('Using saved simulator URL:', saved);
    return saved;
  }

  if (envUrl) {
    console.log('Using ENV simulator URL:', envUrl);
    return envUrl;
  }

  const fallback = `${window.location.protocol}//${window.location.hostname}:3011`;
  console.log('Using fallback simulator URL:', fallback);

  return fallback;
}

const deviceSimulatorApi = axios.create({
  baseURL: defaultDeviceSimulatorUrl(),
});

// 🔹 Get current URL
export function getDeviceSimulatorUrl() {
  return deviceSimulatorApi.defaults.baseURL ?? defaultDeviceSimulatorUrl();
}

// 🔹 Manually override URL
export function setDeviceSimulatorUrl(nextUrl: string) {
  const normalized = nextUrl.trim().replace(/\/$/, '');
  deviceSimulatorApi.defaults.baseURL = normalized;
  localStorage.setItem(DEVICE_SIMULATOR_URL_STORAGE_KEY, normalized);
}

// 🔹 API calls
export async function getAssignedDevices() {
  return deviceSimulatorApi.get('/devices');
}

export async function getBridgeHealth() {
  return deviceSimulatorApi.get<BridgeHealth>('/health');
}

export async function publishTelemetry(request: PublishTelemetryRequest) {
  return deviceSimulatorApi.post('/publish', request);
}