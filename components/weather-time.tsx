'use client';

import { useEffect, useState } from 'react';
import { Clock, MapPin, Thermometer, Droplets, Wind } from 'lucide-react';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  timezone: number; // seconds offset from UTC for the requested location
}

interface WeatherTimeProps {
  city?: string;
  countryCode?: string;
  apiKey?: string;
}

export default function WeatherTime({
  city = 'São Paulo',
  countryCode = 'BR',
  apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
}: WeatherTimeProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set time on mount and update every second (avoid computing time during render)
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      if (!apiKey) {
        setError('OpenWeather API key not configured');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const cityParam = encodeURIComponent(`${city},${countryCode}`);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityParam}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch weather'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, countryCode, apiKey]);

  const formatCityTime = (date: Date, timezoneOffsetSeconds: number) => {
    const shifted = new Date(date.getTime() + timezoneOffsetSeconds * 1000);
    return new Intl.DateTimeFormat(undefined, {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(shifted);
  };

  const formatCityDate = (date: Date, timezoneOffsetSeconds: number) => {
    const shifted = new Date(date.getTime() + timezoneOffsetSeconds * 1000);
    return new Intl.DateTimeFormat(undefined, {
      timeZone: 'UTC',
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(shifted);
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-950">
        <p className="text-red-600 dark:text-red-400">
          Weather data unavailable
        </p>
        <p className="text-sm text-red-500 dark:text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="border-border bg-card flex flex-col items-center gap-4 rounded-lg border p-6">
      {/* Location */}
      <div className="flex items-center gap-1 text-sm">
        <MapPin size={16} />
        <span>
          {city}, {countryCode}
        </span>
      </div>

      {/* Date */}
      <div className="text-muted-foreground text-sm">
        {currentTime && weather
          ? formatCityDate(currentTime, weather.timezone)
          : 'Loading...'}
      </div>

      {/* Current Time */}
      <div className="flex items-center gap-1">
        <Clock size={16} />
        <span>
          {currentTime && weather
            ? formatCityTime(currentTime, weather.timezone)
            : '--:--:--'}
        </span>
      </div>

      {/* Weather */}
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
          <span>Loading weather...</span>
        </div>
      ) : weather ? (
        <div className="flex flex-col items-center gap-2">
          {/* Temperature */}
          <div className="flex items-center text-2xl font-bold">
            <Thermometer />
            <span>{Math.round(weather.main.temp)}°C</span>
            <span className="text-muted-foreground ml-1">
              <span className="text-xs">
                / {Math.round((weather.main.temp * 9) / 5 + 32)}°F
              </span>
            </span>
          </div>

          {/* Weather Description */}
          <div className="text-muted-foreground text-sm capitalize">
            {weather.weather[0].description}
          </div>

          {/* Additional Weather Info */}
          <div className="text-muted-foreground flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Droplets size={16} />
              <span>{weather.main.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind size={16} />
              <span>{Math.round(weather.wind.speed)} m/s</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
