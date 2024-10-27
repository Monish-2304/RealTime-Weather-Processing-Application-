export interface User {
  _id: string;
  username: string;
  city?: string;
  temperatureThreshold?: number;
}

export interface AuthStatusData {
  authenticated: boolean;
  message?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}
