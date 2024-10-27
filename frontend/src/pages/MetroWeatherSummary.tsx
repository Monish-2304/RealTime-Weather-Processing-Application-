import { useState, useEffect } from "react";
import {
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CitySummary,
  WeeklySummary,
  CityWeeklyData,
} from "@/types/summary.types";
import { ThermometerSun } from "lucide-react";
import axios from "axios";

const MetroWeatherSummary = () => {
  const [summaryData, setSummaryData] = useState<CitySummary[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedTempType, setSelectedTempType] = useState("averageTemp");
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchSummaryData = async () => {
      setLoading(true);
      try {
        const summaryResponse = await axios.get(
          "http://127.0.0.1:5000/api/weather/summary/metros/all"
        );
        setSummaryData(summaryResponse.data);
      } catch (error) {
        console.error("Error fetching summary data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (activeTab !== "weekly") return;
      setLoading(true);
      try {
        const weeklyResponse = await axios.get(
          "http://127.0.0.1:5000/api/weather/summary/metros/weekly"
        );
        const weeklyResult: CityWeeklyData[] = weeklyResponse.data;

        const processedData: Record<string, WeeklySummary> = {};

        weeklyResult.forEach((cityData) => {
          cityData.dailySummary.forEach((summary) => {
            const date = new Date(summary.date).toLocaleDateString();
            if (!processedData[date]) {
              processedData[date] = { date };
            }
            processedData[date] = {
              ...processedData[date],
              [cityData.name]:
                selectedTempType === "averageTemp"
                  ? (summary.tempSum / summary.tempCount).toFixed(2)
                  : selectedTempType === "maxTemp"
                  ? summary.maxTemp
                  : summary.minTemp,
            };
          });
        });

        const sortedData = Object.values(processedData).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setWeeklyData(sortedData);
      } catch (error) {
        console.error("Error fetching weekly data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, [selectedTempType, activeTab]);

  const formatDate = (date: string) => {
    if (windowWidth < 768) {
      const d = new Date(date);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    }
    return date;
  };

  const cityColors: Record<string, string> = {
    Delhi: "#FF6B6B",
    Mumbai: "#FCAB10",
    Chennai: "#45B7D1",
    Bangalore: "#0C7C59",
    Kolkata: "#C2E812",
    Hyderabad: "#D4A5A5",
  };

  const getMostFrequentCondition = (conditions: [string, number][]) => {
    if (!conditions || conditions.length === 0) return null;
    return conditions.reduce((max, current) =>
      current[1] > max[1] ? current : max
    );
  };

  const formatToTwoDecimals = (value: any): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return "0.00";
    }
    return Number(value).toFixed(2);
  };

  const customTooltipFormatter = (value: any) => {
    if (value === null || value === undefined) {
      return "N/A";
    }
    return formatToTwoDecimals(value);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Metro Cities Weather Summary</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-lg font-semibold">Loading...</span>
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="current"
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="current">Current Summary</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {summaryData.map((city) => {
                const mostFrequent = getMostFrequentCondition(
                  city.weatherConditions
                );
                return (
                  <Card key={city.city} className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{city.city}</span>
                        <ThermometerSun className="h-6 w-6" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Average Temperature:</span>
                          <span className="font-semibold">
                            {city.averageTemp.toFixed(1)}°C
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Max Temperature:</span>
                          <span className="font-semibold text-red-500">
                            {city.maxTemp}°C
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Min Temperature:</span>
                          <span className="font-semibold text-blue-500">
                            {city.minTemp}°C
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-semibold mb-2">
                            Dominant Weather Condition:
                          </h4>
                          {mostFrequent && (
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              {mostFrequent[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Current Summary Chart */}
            <div className="mt-8">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base sm:text-lg">
                    Current Temperature Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                  <div className="h-[300px] sm:h-[400px] md:h-[500px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={summaryData}
                        margin={{
                          top: 20,
                          right: windowWidth < 768 ? 10 : 30,
                          left: windowWidth < 768 ? 0 : 20,
                          bottom: windowWidth < 768 ? 40 : 60,
                        }}
                      >
                        <XAxis
                          dataKey="city"
                          tick={{ fontSize: windowWidth < 768 ? 10 : 12 }}
                        />
                        <YAxis
                          label={{
                            value: "Temperature (°C)",
                            angle: -90,
                            position: "insideLeft",
                          }}
                          tick={{ fontSize: windowWidth < 768 ? 10 : 12 }}
                        />
                        <Tooltip formatter={customTooltipFormatter} />
                        <Legend />
                        <Bar
                          dataKey="averageTemp"
                          fill="#4C5B7F"
                          name="Average"
                          label={({ value }: { value: number }) => (
                            <text>{formatToTwoDecimals(value)}</text>
                          )}
                        />
                        <Bar dataKey="maxTemp" fill="#FF6F61" name="Max" />
                        <Bar dataKey="minTemp" fill="#3F4B3B" name="Min" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Weekly Summary Chart */}
          <TabsContent value="weekly">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base sm:text-lg">
                  Weekly Temperature Trends
                </CardTitle>
                <select
                  value={selectedTempType}
                  onChange={(e) => setSelectedTempType(e.target.value)}
                  className="p-2 mt-2 border border-gray-300 rounded"
                >
                  <option value="averageTemp">Average Temperature</option>
                  <option value="maxTemp">Max Temperature</option>
                  <option value="minTemp">Min Temperature</option>
                </select>
              </CardHeader>
              <CardContent className="p-2 sm:p-4">
                <div className="h-[300px] sm:h-[400px] md:h-[500px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weeklyData}
                      margin={{
                        top: 20,
                        right: windowWidth < 768 ? 10 : 30,
                        left: windowWidth < 768 ? 0 : 20,
                        bottom: windowWidth < 768 ? 40 : 60,
                      }}
                    >
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        tick={{ fontSize: windowWidth < 768 ? 10 : 12 }}
                      />
                      <YAxis
                        label={{
                          value: "Temperature (°C)",
                          angle: -90,
                          position: "insideLeft",
                        }}
                        tick={{ fontSize: windowWidth < 768 ? 10 : 12 }}
                      />
                      <Tooltip
                        formatter={(value: number) =>
                          formatToTwoDecimals(value)
                        }
                      />
                      <Legend />
                      {summaryData.map((city) => (
                        <Line
                          key={city.city}
                          type="monotone"
                          dataKey={city.city}
                          stroke={cityColors[city.city]}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default MetroWeatherSummary;
