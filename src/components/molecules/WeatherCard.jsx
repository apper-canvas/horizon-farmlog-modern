import React from 'react';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const WeatherCard = ({ weather, compact = false }) => {
  const getWeatherIcon = (condition) => {
    const conditions = {
      'sunny': 'Sun',
      'clear': 'Sun',
      'partly cloudy': 'CloudSun',
      'cloudy': 'Cloud',
      'overcast': 'CloudDrizzle',
      'rain': 'CloudRain',
      'thunderstorm': 'CloudLightning',
      'snow': 'CloudSnow',
      'fog': 'CloudFog',
      'windy': 'Wind'
    };
    
    return conditions[condition.toLowerCase()] || 'Cloud';
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 80) return 'text-red-500';
    if (temp >= 70) return 'text-orange-500';
    if (temp >= 60) return 'text-yellow-500';
    if (temp >= 50) return 'text-green-500';
    return 'text-blue-500';
  };

  if (!weather) {
    return (
      <Card className="animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={compact ? 'p-4' : 'p-6'}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-sm font-medium text-gray-600 high-contrast">
              {weather.location || 'Current Weather'}
            </h3>
            {weather.isAlert && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
                <ApperIcon name="AlertTriangle" size={12} className="text-yellow-600" />
                <span className="text-xs font-medium text-yellow-600">Alert</span>
              </div>
            )}
          </div>
          
          <div className="flex items-baseline space-x-1 mb-2">
            <span className={`text-2xl font-bold ${getTemperatureColor(weather.temperature)} high-contrast`}>
              {weather.temperature}°
            </span>
            <span className="text-sm text-gray-500">
              / {weather.humidity}% humidity
            </span>
          </div>
          
          <p className="text-sm text-gray-600 capitalize mb-1">
            {weather.condition}
          </p>
          
          {weather.precipitation > 0 && (
            <div className="flex items-center space-x-1 text-sm text-blue-600">
              <ApperIcon name="CloudRain" size={14} />
              <span>{weather.precipitation}% chance of rain</span>
            </div>
          )}
          
          {weather.windSpeed && (
            <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
              <ApperIcon name="Wind" size={14} />
              <span>{weather.windSpeed} mph</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center ml-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-2">
            <ApperIcon 
              name={getWeatherIcon(weather.condition)} 
              size={24} 
              className="text-blue-600"
            />
          </div>
          
          {weather.uvIndex && (
            <div className="text-xs text-gray-500 text-center">
              UV: {weather.uvIndex}
            </div>
          )}
        </div>
      </div>
      
      {weather.forecast && weather.forecast.length > 0 && !compact && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            {weather.forecast.slice(0, 3).map((day, index) => (
              <div key={index} className="text-xs">
                <div className="text-gray-600 mb-1">{day.day}</div>
                <ApperIcon 
                  name={getWeatherIcon(day.condition)} 
                  size={16} 
                  className="mx-auto mb-1 text-gray-500"
                />
                <div className="text-gray-900 font-medium">
                  {day.high}°/{day.low}°
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default WeatherCard;