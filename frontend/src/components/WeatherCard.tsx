import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeatherData {
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

const WeatherCard: React.FC<{ city: string; data?: WeatherData | null }> = ({
  data,
}) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="bg-blue-300 ">
      <CardHeader>
        <CardTitle>{data.city}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Temperature: {data.temp.toFixed(1)}°C</p>
        <p>Humidity: {data.humidity}%</p>
        <p>Max Temp: {data.temp_max.toFixed(1)}°C</p>
        <p>Min Temp: {data.temp_min.toFixed(1)}°C</p>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
