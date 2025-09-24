import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock weather data - in real app, you'd fetch from weather API
    const mockWeather: WeatherData = {
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      condition: ['sunny', 'cloudy', 'rainy', 'windy'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      location: 'Your Location'
    };

    setTimeout(() => {
      setWeather(mockWeather);
      setLoading(false);
    }, 1000);

    // Update every 10 minutes
    let isMounted = true;
    const interval = setInterval(() => {
      if (isMounted) {
        setWeather(prev => prev ? {
          ...prev,
          temperature: Math.floor(Math.random() * 15) + 20,
          humidity: Math.floor(Math.random() * 40) + 40,
          windSpeed: Math.floor(Math.random() * 20) + 5,
        } : null);
      }
    }, 600000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-400" />;
      case 'snowy': return <CloudSnow className="h-8 w-8 text-white" />;
      default: return <Sun className="h-8 w-8 text-yellow-400" />;
    }
  };

  const getWeatherGradient = (condition: string) => {
    switch (condition) {
      case 'sunny': return 'from-yellow-500/20 to-orange-500/20';
      case 'cloudy': return 'from-gray-500/20 to-slate-500/20';
      case 'rainy': return 'from-blue-500/20 to-indigo-500/20';
      case 'snowy': return 'from-blue-200/20 to-white/20';
      default: return 'from-yellow-500/20 to-orange-500/20';
    }
  };

  if (loading) {
    return (
      <Card className="glass-card animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Cloud className="h-5 w-5 text-accent" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Loading weather...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Cloud className="h-5 w-5 text-accent" />
          Weather
          <div className="ml-auto">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`rounded-lg p-4 bg-gradient-to-br ${getWeatherGradient(weather.condition)}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-foreground">
                {weather.temperature}°C
              </div>
              <div className="text-sm text-muted-foreground capitalize">
                {weather.condition}
              </div>
            </div>
            <div className="flex items-center">
              {getWeatherIcon(weather.condition)}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-blue-400" />
              <span className="text-muted-foreground">Humidity</span>
              <span className="font-medium">{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-green-400" />
              <span className="text-muted-foreground">Wind</span>
              <span className="font-medium">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
