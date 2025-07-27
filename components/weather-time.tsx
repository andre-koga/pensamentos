'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
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
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
  }, []);

  // Update time every second
  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

  // Fetch weather data
  useEffect(() => {
    if (!mounted) return;

    const fetchWeather = async () => {
      if (!apiKey) {
        setError('OpenWeather API key not configured');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${apiKey}`
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
  }, [city, countryCode, apiKey, mounted]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="border-border bg-card flex flex-col items-center gap-4 rounded-lg border p-6">
        <div className="flex items-center gap-2 font-mono text-lg">
          <Clock />
          <span>--:--:--</span>
        </div>
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

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
      {/* Current Time */}
      <div className="flex items-center gap-2 font-mono text-lg">
        <Clock />
        <span>
          {currentTime ? format(currentTime, 'HH:mm:ss') : '--:--:--'}
        </span>
      </div>

      {/* Date */}
      <div className="text-muted-foreground text-sm">
        {currentTime
          ? format(currentTime, 'EEEE, MMMM do, yyyy')
          : 'Loading...'}
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm">
        <MapPin />
        <span>
          {city}, {countryCode}
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
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Thermometer />
            <span>{Math.round(weather.main.temp)}°C</span>
          </div>

          {/* Weather Description */}
          <div className="text-muted-foreground text-sm capitalize">
            {weather.weather[0].description}
          </div>

          {/* Additional Weather Info */}
          <div className="text-muted-foreground flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Droplets />
              <span>{weather.main.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind />
              <span>{Math.round(weather.wind.speed)} m/s</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
