import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface WeatherData {
  city: string;
  temp: number;
  [key: string]: any; // For any additional properties from the API
}

interface WeatherChartProps {
  cities: string[];
}

const WeatherChart: React.FC<WeatherChartProps> = ({ cities }) => {
  const [chartData, setChartData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await Promise.all(
          cities.map(async (city) => {
            const response = await fetch(
              `http://127.0.0.1:5000/api/weather/city/${city}`
            );
            if (!response.ok) {
              throw new Error(`Failed to fetch data for ${city}`);
            }
            const result: WeatherData = await response.json();
            return result;
          })
        );
        setChartData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cities]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-center md:text-left">
          Live Temperature Comparison for Metro Cities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="city"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  value: "Temperature (°C)",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Temperature"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherChart;
