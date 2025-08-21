'use client';

import { useCallback, useEffect, useState } from 'react';
import { MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  timezone: number;
}

interface City {
  name: string;
  country: string;
  countryCode: string;
}

interface WeatherTimeProps {
  apiKey?: string;
}

// Famous cities around the world
const FAMOUS_CITIES: City[] = [
  { name: 'Kabul', country: 'Afghanistan', countryCode: 'AF' },
  { name: 'Tirana', country: 'Albania', countryCode: 'AL' },
  { name: 'Algiers', country: 'Algeria', countryCode: 'DZ' },
  { name: 'Andorra la Vella', country: 'Andorra', countryCode: 'AD' },
  { name: 'Luanda', country: 'Angola', countryCode: 'AO' },
  { name: "Saint John's", country: 'Antigua and Barbuda', countryCode: 'AG' },
  { name: 'Buenos Aires', country: 'Argentina', countryCode: 'AR' },
  { name: 'Yerevan', country: 'Armenia', countryCode: 'AM' },
  { name: 'Canberra', country: 'Australia', countryCode: 'AU' },
  { name: 'Vienna', country: 'Austria', countryCode: 'AT' },
  { name: 'Baku', country: 'Azerbaijan', countryCode: 'AZ' },
  { name: 'Nassau', country: 'Bahamas', countryCode: 'BS' },
  { name: 'Manama', country: 'Bahrain', countryCode: 'BH' },
  { name: 'Dhaka', country: 'Bangladesh', countryCode: 'BD' },
  { name: 'Bridgetown', country: 'Barbados', countryCode: 'BB' },
  { name: 'Minsk', country: 'Belarus', countryCode: 'BY' },
  { name: 'Brussels', country: 'Belgium', countryCode: 'BE' },
  { name: 'Belmopan', country: 'Belize', countryCode: 'BZ' },
  { name: 'Porto-Novo', country: 'Benin', countryCode: 'BJ' },
  { name: 'Thimphu', country: 'Bhutan', countryCode: 'BT' },
  { name: 'La Paz', country: 'Bolivia', countryCode: 'BO' },
  { name: 'Sarajevo', country: 'Bosnia and Herzegovina', countryCode: 'BA' },
  { name: 'Gaborone', country: 'Botswana', countryCode: 'BW' },
  { name: 'Brasília', country: 'Brazil', countryCode: 'BR' },
  { name: 'Bandar Seri Begawan', country: 'Brunei', countryCode: 'BN' },
  { name: 'Sofia', country: 'Bulgaria', countryCode: 'BG' },
  { name: 'Ouagadougou', country: 'Burkina Faso', countryCode: 'BF' },
  { name: 'Bujumbura', country: 'Burundi', countryCode: 'BI' },
  { name: 'Phnom Penh', country: 'Cambodia', countryCode: 'KH' },
  { name: 'Yaoundé', country: 'Cameroon', countryCode: 'CM' },
  { name: 'Ottawa', country: 'Canada', countryCode: 'CA' },
  { name: 'Praia', country: 'Cape Verde', countryCode: 'CV' },
  { name: 'Bangui', country: 'Central African Republic', countryCode: 'CF' },
  { name: "N'Djamena", country: 'Chad', countryCode: 'TD' },
  { name: 'Santiago', country: 'Chile', countryCode: 'CL' },
  { name: 'Beijing', country: 'China', countryCode: 'CN' },
  { name: 'Bogotá', country: 'Colombia', countryCode: 'CO' },
  { name: 'Moroni', country: 'Comoros', countryCode: 'KM' },
  { name: 'Brazzaville', country: 'Congo', countryCode: 'CG' },
  {
    name: 'Kinshasa',
    country: 'Democratic Republic of the Congo',
    countryCode: 'CD',
  },
  { name: 'San José', country: 'Costa Rica', countryCode: 'CR' },
  { name: 'Zagreb', country: 'Croatia', countryCode: 'HR' },
  { name: 'Havana', country: 'Cuba', countryCode: 'CU' },
  { name: 'Nicosia', country: 'Cyprus', countryCode: 'CY' },
  { name: 'Prague', country: 'Czech Republic', countryCode: 'CZ' },
  { name: 'Copenhagen', country: 'Denmark', countryCode: 'DK' },
  { name: 'Djibouti', country: 'Djibouti', countryCode: 'DJ' },
  { name: 'Roseau', country: 'Dominica', countryCode: 'DM' },
  { name: 'Santo Domingo', country: 'Dominican Republic', countryCode: 'DO' },
  { name: 'Dili', country: 'East Timor', countryCode: 'TL' },
  { name: 'Quito', country: 'Ecuador', countryCode: 'EC' },
  { name: 'Cairo', country: 'Egypt', countryCode: 'EG' },
  { name: 'San Salvador', country: 'El Salvador', countryCode: 'SV' },
  { name: 'Malabo', country: 'Equatorial Guinea', countryCode: 'GQ' },
  { name: 'Asmara', country: 'Eritrea', countryCode: 'ER' },
  { name: 'Tallinn', country: 'Estonia', countryCode: 'EE' },
  { name: 'Mbabane', country: 'Eswatini', countryCode: 'SZ' },
  { name: 'Addis Ababa', country: 'Ethiopia', countryCode: 'ET' },
  { name: 'Suva', country: 'Fiji', countryCode: 'FJ' },
  { name: 'Helsinki', country: 'Finland', countryCode: 'FI' },
  { name: 'Paris', country: 'France', countryCode: 'FR' },
  { name: 'Libreville', country: 'Gabon', countryCode: 'GA' },
  { name: 'Banjul', country: 'Gambia', countryCode: 'GM' },
  { name: 'Tbilisi', country: 'Georgia', countryCode: 'GE' },
  { name: 'Berlin', country: 'Germany', countryCode: 'DE' },
  { name: 'Accra', country: 'Ghana', countryCode: 'GH' },
  { name: 'Athens', country: 'Greece', countryCode: 'GR' },
  { name: "Saint George's", country: 'Grenada', countryCode: 'GD' },
  { name: 'Guatemala City', country: 'Guatemala', countryCode: 'GT' },
  { name: 'Conakry', country: 'Guinea', countryCode: 'GN' },
  { name: 'Bissau', country: 'Guinea-Bissau', countryCode: 'GW' },
  { name: 'Georgetown', country: 'Guyana', countryCode: 'GY' },
  { name: 'Port-au-Prince', country: 'Haiti', countryCode: 'HT' },
  { name: 'Tegucigalpa', country: 'Honduras', countryCode: 'HN' },
  { name: 'Budapest', country: 'Hungary', countryCode: 'HU' },
  { name: 'Reykjavík', country: 'Iceland', countryCode: 'IS' },
  { name: 'New Delhi', country: 'India', countryCode: 'IN' },
  { name: 'Jakarta', country: 'Indonesia', countryCode: 'ID' },
  { name: 'Tehran', country: 'Iran', countryCode: 'IR' },
  { name: 'Baghdad', country: 'Iraq', countryCode: 'IQ' },
  { name: 'Dublin', country: 'Ireland', countryCode: 'IE' },
  { name: 'Jerusalem', country: 'Israel', countryCode: 'IL' },
  { name: 'Rome', country: 'Italy', countryCode: 'IT' },
  { name: 'Kingston', country: 'Jamaica', countryCode: 'JM' },
  { name: 'Tokyo', country: 'Japan', countryCode: 'JP' },
  { name: 'Amman', country: 'Jordan', countryCode: 'JO' },
  { name: 'Astana', country: 'Kazakhstan', countryCode: 'KZ' },
  { name: 'Nairobi', country: 'Kenya', countryCode: 'KE' },
  { name: 'Tarawa', country: 'Kiribati', countryCode: 'KI' },
  { name: 'Pristina', country: 'Kosovo', countryCode: 'XK' },
  { name: 'Kuwait City', country: 'Kuwait', countryCode: 'KW' },
  { name: 'Bishkek', country: 'Kyrgyzstan', countryCode: 'KG' },
  { name: 'Vientiane', country: 'Laos', countryCode: 'LA' },
  { name: 'Riga', country: 'Latvia', countryCode: 'LV' },
  { name: 'Beirut', country: 'Lebanon', countryCode: 'LB' },
  { name: 'Maseru', country: 'Lesotho', countryCode: 'LS' },
  { name: 'Monrovia', country: 'Liberia', countryCode: 'LR' },
  { name: 'Tripoli', country: 'Libya', countryCode: 'LY' },
  { name: 'Vaduz', country: 'Liechtenstein', countryCode: 'LI' },
  { name: 'Vilnius', country: 'Lithuania', countryCode: 'LT' },
  { name: 'Luxembourg City', country: 'Luxembourg', countryCode: 'LU' },
  { name: 'Antananarivo', country: 'Madagascar', countryCode: 'MG' },
  { name: 'Lilongwe', country: 'Malawi', countryCode: 'MW' },
  { name: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY' },
  { name: 'Male', country: 'Maldives', countryCode: 'MV' },
  { name: 'Bamako', country: 'Mali', countryCode: 'ML' },
  { name: 'Valletta', country: 'Malta', countryCode: 'MT' },
  { name: 'Majuro', country: 'Marshall Islands', countryCode: 'MH' },
  { name: 'Nouakchott', country: 'Mauritania', countryCode: 'MR' },
  { name: 'Port Louis', country: 'Mauritius', countryCode: 'MU' },
  { name: 'Mexico City', country: 'Mexico', countryCode: 'MX' },
  { name: 'Palikir', country: 'Micronesia', countryCode: 'FM' },
  { name: 'Chișinău', country: 'Moldova', countryCode: 'MD' },
  { name: 'Monaco', country: 'Monaco', countryCode: 'MC' },
  { name: 'Ulaanbaatar', country: 'Mongolia', countryCode: 'MN' },
  { name: 'Podgorica', country: 'Montenegro', countryCode: 'ME' },
  { name: 'Rabat', country: 'Morocco', countryCode: 'MA' },
  { name: 'Maputo', country: 'Mozambique', countryCode: 'MZ' },
  { name: 'Naypyidaw', country: 'Myanmar', countryCode: 'MM' },
  { name: 'Windhoek', country: 'Namibia', countryCode: 'NA' },
  { name: 'Yaren', country: 'Nauru', countryCode: 'NR' },
  { name: 'Kathmandu', country: 'Nepal', countryCode: 'NP' },
  { name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL' },
  { name: 'Wellington', country: 'New Zealand', countryCode: 'NZ' },
  { name: 'Managua', country: 'Nicaragua', countryCode: 'NI' },
  { name: 'Niamey', country: 'Niger', countryCode: 'NE' },
  { name: 'Abuja', country: 'Nigeria', countryCode: 'NG' },
  { name: 'Pyongyang', country: 'North Korea', countryCode: 'KP' },
  { name: 'Skopje', country: 'North Macedonia', countryCode: 'MK' },
  { name: 'Oslo', country: 'Norway', countryCode: 'NO' },
  { name: 'Muscat', country: 'Oman', countryCode: 'OM' },
  { name: 'Islamabad', country: 'Pakistan', countryCode: 'PK' },
  { name: 'Ngerulmud', country: 'Palau', countryCode: 'PW' },
  { name: 'Panama City', country: 'Panama', countryCode: 'PA' },
  { name: 'Port Moresby', country: 'Papua New Guinea', countryCode: 'PG' },
  { name: 'Asunción', country: 'Paraguay', countryCode: 'PY' },
  { name: 'Lima', country: 'Peru', countryCode: 'PE' },
  { name: 'Manila', country: 'Philippines', countryCode: 'PH' },
  { name: 'Warsaw', country: 'Poland', countryCode: 'PL' },
  { name: 'Lisbon', country: 'Portugal', countryCode: 'PT' },
  { name: 'Doha', country: 'Qatar', countryCode: 'QA' },
  { name: 'Bucharest', country: 'Romania', countryCode: 'RO' },
  { name: 'Moscow', country: 'Russia', countryCode: 'RU' },
  { name: 'Kigali', country: 'Rwanda', countryCode: 'RW' },
  { name: 'Basseterre', country: 'Saint Kitts and Nevis', countryCode: 'KN' },
  { name: 'Castries', country: 'Saint Lucia', countryCode: 'LC' },
  {
    name: 'Kingstown',
    country: 'Saint Vincent and the Grenadines',
    countryCode: 'VC',
  },
  { name: 'Apia', country: 'Samoa', countryCode: 'WS' },
  { name: 'San Marino', country: 'San Marino', countryCode: 'SM' },
  { name: 'São Tomé', country: 'São Tomé and Príncipe', countryCode: 'ST' },
  { name: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA' },
  { name: 'Dakar', country: 'Senegal', countryCode: 'SN' },
  { name: 'Belgrade', country: 'Serbia', countryCode: 'RS' },
  { name: 'Victoria', country: 'Seychelles', countryCode: 'SC' },
  { name: 'Freetown', country: 'Sierra Leone', countryCode: 'SL' },
  { name: 'Singapore', country: 'Singapore', countryCode: 'SG' },
  { name: 'Bratislava', country: 'Slovakia', countryCode: 'SK' },
  { name: 'Ljubljana', country: 'Slovenia', countryCode: 'SI' },
  { name: 'Honiara', country: 'Solomon Islands', countryCode: 'SB' },
  { name: 'Mogadishu', country: 'Somalia', countryCode: 'SO' },
  { name: 'Pretoria', country: 'South Africa', countryCode: 'ZA' },
  { name: 'Seoul', country: 'South Korea', countryCode: 'KR' },
  { name: 'Juba', country: 'South Sudan', countryCode: 'SS' },
  { name: 'Madrid', country: 'Spain', countryCode: 'ES' },
  { name: 'Colombo', country: 'Sri Lanka', countryCode: 'LK' },
  { name: 'Khartoum', country: 'Sudan', countryCode: 'SD' },
  { name: 'Paramaribo', country: 'Suriname', countryCode: 'SR' },
  { name: 'Stockholm', country: 'Sweden', countryCode: 'SE' },
  { name: 'Bern', country: 'Switzerland', countryCode: 'CH' },
  { name: 'Damascus', country: 'Syria', countryCode: 'SY' },
  { name: 'Taipei', country: 'Taiwan', countryCode: 'TW' },
  { name: 'Dushanbe', country: 'Tajikistan', countryCode: 'TJ' },
  { name: 'Dodoma', country: 'Tanzania', countryCode: 'TZ' },
  { name: 'Bangkok', country: 'Thailand', countryCode: 'TH' },
  { name: 'Dili', country: 'Timor-Leste', countryCode: 'TL' },
  { name: 'Lomé', country: 'Togo', countryCode: 'TG' },
  { name: 'Nukuʻalofa', country: 'Tonga', countryCode: 'TO' },
  { name: 'Port of Spain', country: 'Trinidad and Tobago', countryCode: 'TT' },
  { name: 'Tunis', country: 'Tunisia', countryCode: 'TN' },
  { name: 'Ankara', country: 'Turkey', countryCode: 'TR' },
  { name: 'Ashgabat', country: 'Turkmenistan', countryCode: 'TM' },
  { name: 'Funafuti', country: 'Tuvalu', countryCode: 'TV' },
  { name: 'Kampala', country: 'Uganda', countryCode: 'UG' },
  { name: 'Kyiv', country: 'Ukraine', countryCode: 'UA' },
  { name: 'Abu Dhabi', country: 'United Arab Emirates', countryCode: 'AE' },
  { name: 'London', country: 'United Kingdom', countryCode: 'GB' },
  { name: 'Washington, D.C.', country: 'United States', countryCode: 'US' },
  { name: 'Montevideo', country: 'Uruguay', countryCode: 'UY' },
  { name: 'Tashkent', country: 'Uzbekistan', countryCode: 'UZ' },
  { name: 'Port Vila', country: 'Vanuatu', countryCode: 'VU' },
  { name: 'Vatican City', country: 'Vatican City', countryCode: 'VA' },
  { name: 'Caracas', country: 'Venezuela', countryCode: 'VE' },
  { name: 'Hanoi', country: 'Vietnam', countryCode: 'VN' },
  { name: "Sana'a", country: 'Yemen', countryCode: 'YE' },
  { name: 'Lusaka', country: 'Zambia', countryCode: 'ZM' },
  { name: 'Harare', country: 'Zimbabwe', countryCode: 'ZW' },
  { name: 'Guarulhos', country: 'Brazil', countryCode: 'BR' }, // special ones
  { name: 'Atlanta', country: 'United States', countryCode: 'US' },
];

export default function WeatherTime({
  apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
}: WeatherTimeProps) {
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherFact, setWeatherFact] = useState<string>('');

  // Pick a random city
  const pickRandomCity = (): City => {
    return FAMOUS_CITIES[Math.floor(Math.random() * FAMOUS_CITIES.length)];
  };

  // Generate a single, brief weather fact
  const generateWeatherFact = (
    weatherData: WeatherData,
    city: City
  ): string => {
    const temp = Math.round(weatherData.main.temp);
    const tempF = Math.round((temp * 9) / 5 + 32);
    const description = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;
    const windSpeed = Math.round(weatherData.wind.speed);

    const factVariations = [
      `A gentle breeze of ${windSpeed} m/s whispers through the streets of ${city.name}.`,
      `The air in ${city.name} carries ${humidity}% humidity today.`,
      `Temperatures in ${city.name} hover around ${temp}°C (${tempF}°F).`,
      `The sky above ${city.name} wears a ${description} veil.`,
      `Winds dance at ${windSpeed} m/s in ${city.name}.`,
      `${city.name} basks in ${temp}°C warmth.`,
      `The atmosphere in ${city.name} feels ${description}.`,
      `A ${windSpeed} m/s breeze caresses ${city.name}.`,
      `${city.name} experiences ${humidity}% humidity in the air.`,
      `The weather in ${city.name} is ${description}.`,
      `Light winds of ${windSpeed} m/s flow through ${city.name}.`,
      `The humidity in ${city.name} measures at ${humidity}% today.`,
      `It's ${temp}°C (${tempF}°F) in ${city.name} right now.`,
      `${city.name} is under a ${description} sky.`,
      `Breezes of ${windSpeed} m/s move across ${city.name}.`,
      `${city.name} enjoys ${temp}°C temperatures.`,
      `The conditions in ${city.name} are ${description}.`,
      `A soft wind of ${windSpeed} m/s touches ${city.name}.`,
      `Air moisture in ${city.name} is at ${humidity}%.`,
      `${city.name} has ${temp}°C (${tempF}°F) weather.`,
      `The wind speed in ${city.name} is ${windSpeed} m/s.`,
      `${city.name} records ${humidity}% humidity.`,
      `The thermometer reads ${temp}°C (${tempF}°F) in ${city.name}.`,
      `Clouds form a ${description} pattern over ${city.name}.`,
      `Gentle currents of ${windSpeed} m/s move through ${city.name}.`,
      `${city.name} is experiencing ${temp}°C warmth.`,
      `The weather pattern in ${city.name} is ${description}.`,
      `Winds at ${windSpeed} m/s flow across ${city.name}.`,
      `Humidity levels in ${city.name} reach ${humidity}%.`,
      `Current temperature in ${city.name}: ${temp}°C (${tempF}°F).`,
    ];

    return factVariations[Math.floor(Math.random() * factVariations.length)];
  };

  // Fetch weather data for a city
  const fetchWeather = useCallback(
    async (city: City) => {
      if (!apiKey) {
        setError('OpenWeather API key not configured');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const cityParam = encodeURIComponent(
          `${city.name},${city.countryCode}`
        );
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityParam}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setCurrentCity(city);
        setWeatherFact(generateWeatherFact(data, city));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch weather'
        );
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  // Initialize with a random city
  useEffect(() => {
    const randomCity = pickRandomCity();
    fetchWeather(randomCity);
  }, [apiKey, fetchWeather]);

  // Handle refresh with new random city
  const handleRefresh = () => {
    const newCity = pickRandomCity();
    fetchWeather(newCity);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="text-center">
          <p className="mb-2 text-red-600 dark:text-red-400">
            Weather data unavailable
          </p>
          <p className="mb-4 text-sm text-red-500 dark:text-red-500">{error}</p>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <RefreshCw size={16} />
            Try Another City
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      {/* Refresh Button */}
      <Button
        onClick={handleRefresh}
        size="sm"
        variant="ghost"
        className="text-muted-foreground"
      >
        <RefreshCw />
      </Button>

      {/* Current City */}
      {currentCity && (
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} />
          <span className="font-medium">
            {currentCity.name}, {currentCity.country}
          </span>
        </div>
      )}

      {/* Weather Fact */}
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
          <span>Discovering weather...</span>
        </div>
      ) : weatherFact ? (
        <div className="text-center">
          <p className="text-muted-foreground">{weatherFact}</p>
        </div>
      ) : null}
    </div>
  );
}
