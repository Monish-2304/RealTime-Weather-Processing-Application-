import { create } from "zustand";
import { WeatherData } from "@/types/weather.types";

interface WeatherState {
  weatherData: WeatherData[];
  customWeatherData: WeatherData | null;
  alert: string | null;
  alertThreshold: number | null;
  setWeatherData: (data: WeatherData[]) => void;
  setCustomWeatherData: (data: WeatherData) => void;
  setAlert: (message: string) => void;
  setAlertThreshold: (threshold: number) => void;
  clearWeather: () => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  weatherData: [],
  customWeatherData: null,
  alert: null,
  alertThreshold: null,

  setWeatherData: (data) => set({ weatherData: data }),
  setCustomWeatherData: (data) => set({ customWeatherData: data }),
  setAlert: (message) => set({ alert: message }),
  setAlertThreshold: (threshold) => set({ alertThreshold: threshold }),
  clearWeather: () => set({ weatherData: [], customWeatherData: null }),
}));
