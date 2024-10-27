import React, { useEffect, useState } from "react";
import WeatherCard from "../components/WeatherCard";
import WeatherChart from "../components/WeatherChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { Socket } from "socket.io-client";
import { useWeatherStore } from "@/store/weatherStore";
import { WeatherData } from "@/types/weather.types";
import { AuthStatusData } from "@/types/auth.types";

const METRO_CITIES = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "Hyderabad",
];

interface HomeProps {
  socket: Socket;
}

const Home: React.FC<HomeProps> = ({ socket }) => {
  const [cityName, setCityName] = useState<string>("");
  const [alertThreshold, setAlertThreshold] = useState<number | undefined>(
    undefined
  );
  const [customCity, setCustomCity] = useState<string>("");
  const { user, token } = useAuthStore();
  const {
    weatherData,
    customWeatherData,
    alert,
    setAlert,
    setWeatherData,
    setCustomWeatherData,
  } = useWeatherStore();

  useEffect(() => {
    socket.on("weatherData", (data: WeatherData[]) => {
      setWeatherData(data);
    });
    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      socket.emit("authenticate", token);
    }
  }, [socket]);

  useEffect(() => {
    socket.on("authStatus", (data: AuthStatusData) => {
      if (!data.authenticated && token) {
        setAlert("Socket authentication failed. You may need to log in again.");
      }
    });

    socket.on("alert", (alertMessage: string) => {
      setAlert(alertMessage);
    });

    return () => {
      socket.off("authStatus");
      socket.off("alert");
    };
  }, [token, socket]);

  const setUserAlert = async () => {
    if (!token) {
      setAlert("You must be logged in to set an alert.");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:5000/api/weather/alert",
        {
          username: user?.username,
          city: cityName,
          temperatureThreshold: alertThreshold,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlert("Alert set successfully!");
    } catch (error) {
      setAlert("Failed to set alert. Please try again.");
    }
  };

  const getCustomWeather = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/weather/city/${customCity}`
      );
      setCustomWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching custom city weather:", error);
    }
  };

  return (
    <div className="p-4">
      {user && (
        <h2 className="text-xl text-blue-500 font-semibold capitalize my-4">
          Hello {user?.username},
        </h2>
      )}
      <div className="flex justify-between">
        <div className="md:w-[70%] mb-4">
          <h3 className="text-xl font-semibold mb-2">Get Weather for A City</h3>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="City Name"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
            />
            <Button className="w-[6rem] md:w-fit" onClick={getCustomWeather}>
              Get Weather
            </Button>
          </div>
        </div>
        <div className="h-24 w-48 md:h-36 md:w-72 pl-[1.5rem] ">
          <img src={getWeatherIcon()} alt="Weather Icon" />
        </div>
      </div>

      {!user ? (
        <p className="font-semibold text-xl text-green-500">
          Please log in to set alerts!
        </p>
      ) : (
        <div className="md:w-[70%] mb-8">
          <h3 className="text-xl font-semibold mb-2">Set Temperature Alert</h3>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="City Name"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Temperature Threshold"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(Number(e.target.value))}
            />
            <Button onClick={setUserAlert}>Set Alert</Button>
          </div>
          {alert && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Alert</AlertTitle>
              <AlertDescription>{alert}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <div className="mt-8">
        {customWeatherData && (
          <div className="mb-4 w-fit">
            <h3 className="font-semibold text-xl mb-2">
              Weather for Searched City
            </h3>
            <WeatherCard
              city={customWeatherData.city}
              data={customWeatherData}
            />
          </div>
        )}
        <h3 className="font-semibold text-xl mb-2">
          Live Weather Updates for Metro Cities
        </h3>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weatherData.map((weather) => (
            <WeatherCard
              key={weather.city}
              city={weather.city}
              data={weather}
            />
          ))}
        </div>
      </div>

      <WeatherChart cities={METRO_CITIES} />
    </div>
  );
};

const getWeatherIcon = (): string => {
  const currentHour = new Date().getHours();
  if (currentHour >= 6 && currentHour < 18) return "sun.avif";
  if (currentHour >= 18 || currentHour < 6) return "night.png";
  return "night.png";
};

export default Home;
