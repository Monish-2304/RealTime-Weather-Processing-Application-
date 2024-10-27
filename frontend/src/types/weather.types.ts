export interface WeatherData {
  city: string;
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  feels_like: number;
  dt: number;
  weather: {
    main: string;
  }[];
}

export interface Alert {
  city: string;
  temperatureThreshold: number;
}
