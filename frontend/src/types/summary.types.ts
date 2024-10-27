interface WeatherCondition {
  [condition: string]: number;
}
export interface CitySummary {
  city: string;
  averageTemp: number;
  maxTemp: number;
  minTemp: number;
  weatherConditions: [string, number][];
}

export interface WeeklySummary {
  date: string;
  [city: string]: string | number;
}

export interface CityDailySummary {
  date: string;
  tempSum: number;
  tempCount: number;
  maxTemp: number;
  minTemp: number;
  weatherConditions: WeatherCondition;
}

export interface CityWeeklyData {
  name: string;
  dailySummary: CityDailySummary[];
}
