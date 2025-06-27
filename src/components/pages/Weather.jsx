import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import Header from '@/components/organisms/Header';
import WeatherCard from '@/components/molecules/WeatherCard';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { weatherService } from '@/services/api/weatherService';

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError('');
      const [current, forecastData, alertsData] = await Promise.all([
        weatherService.getCurrentWeather(),
        weatherService.getForecast(),
        weatherService.getAlerts()
      ]);
      setCurrentWeather(current);
      setForecast(forecastData);
      setAlerts(alertsData);
    } catch (err) {
      setError('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

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

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'severe':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'moderate':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'minor':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getAlertIcon = (type) => {
    const icons = {
      frost: 'Snowflake',
      drought: 'Sun',
      storm: 'CloudLightning',
      wind: 'Wind',
      hail: 'CloudSnow',
      flood: 'CloudRain'
    };
    return icons[type] || 'AlertTriangle';
  };

  if (loading) {
    return (
      <div className="h-full">
        <Header title="Weather" subtitle="Current conditions and 5-day forecast" />
        <div className="p-4 sm:p-6 lg:p-8">
          <Loading type="dashboard" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <Header title="Weather" />
        <div className="p-4 sm:p-6 lg:p-8">
          <Error 
            message={error} 
            onRetry={loadWeatherData}
            type="network"
          />
        </div>
      </div>
    );
  }

  if (!currentWeather && !forecast.length) {
    return (
      <div className="h-full">
        <Header title="Weather" />
        <div className="p-4 sm:p-6 lg:p-8">
          <Empty 
            type="weather" 
            onAction={loadWeatherData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Header 
        title="Weather" 
        subtitle="Current conditions and 5-day forecast"
        actions={
          <Button 
            variant="outline" 
            icon="RefreshCw" 
            onClick={loadWeatherData}
          >
            Refresh
          </Button>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Current Weather */}
            {currentWeather && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
                  Current Conditions
                </h2>
                <WeatherCard weather={currentWeather} />
              </motion.div>
            )}

            {/* 5-Day Forecast */}
            {forecast.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
                  5-Day Forecast
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {forecast.map((day, index) => (
                    <Card key={index} className="text-center">
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-900">
                          {index === 0 ? 'Today' : format(addDays(new Date(), index), 'EEE')}
                        </div>
                        
                        <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
                          <ApperIcon 
                            name={getWeatherIcon(day.condition)} 
                            size={24} 
                            className="text-blue-600"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <div className={`text-lg font-bold ${getTemperatureColor(day.high)}`}>
                            {day.high}°
                          </div>
                          <div className="text-sm text-gray-600">
                            {day.low}°
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600 capitalize truncate">
                          {day.condition}
                        </div>
                        
                        {day.precipitation > 0 && (
                          <div className="flex items-center justify-center space-x-1 text-xs text-blue-600">
                            <ApperIcon name="CloudRain" size={12} />
                            <span>{day.precipitation}%</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Detailed Conditions */}
            {currentWeather && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
                  Detailed Conditions
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="text-center">
                    <div className="space-y-2">
                      <ApperIcon name="Droplets" size={24} className="mx-auto text-blue-600" />
                      <div className="text-sm text-gray-600">Humidity</div>
                      <div className="text-lg font-bold text-gray-900">{currentWeather.humidity}%</div>
                    </div>
                  </Card>
                  
                  <Card className="text-center">
                    <div className="space-y-2">
                      <ApperIcon name="Wind" size={24} className="mx-auto text-gray-600" />
                      <div className="text-sm text-gray-600">Wind Speed</div>
                      <div className="text-lg font-bold text-gray-900">{currentWeather.windSpeed || 0} mph</div>
                    </div>
                  </Card>
                  
                  <Card className="text-center">
                    <div className="space-y-2">
                      <ApperIcon name="Sun" size={24} className="mx-auto text-yellow-600" />
                      <div className="text-sm text-gray-600">UV Index</div>
                      <div className="text-lg font-bold text-gray-900">{currentWeather.uvIndex || 'N/A'}</div>
                    </div>
                  </Card>
                  
                  <Card className="text-center">
                    <div className="space-y-2">
                      <ApperIcon name="Eye" size={24} className="mx-auto text-purple-600" />
                      <div className="text-sm text-gray-600">Visibility</div>
                      <div className="text-lg font-bold text-gray-900">{currentWeather.visibility || 10} mi</div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Weather Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                Weather Alerts
              </h3>
              {alerts.length === 0 ? (
                <Card>
                  <div className="text-center py-8">
                    <ApperIcon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-4" />
                    <p className="text-gray-600">No active weather alerts</p>
                    <p className="text-sm text-gray-500 mt-2">Conditions are normal</p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert, index) => (
                    <Card key={index} className={`border-l-4 ${getAlertColor(alert.severity)}`}>
                      <div className="flex items-start space-x-3">
                        <ApperIcon 
                          name={getAlertIcon(alert.type)} 
                          size={20} 
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <p className="text-sm mt-1">{alert.description}</p>
                          <p className="text-xs mt-2 opacity-75">
                            Valid until {format(new Date(alert.expires), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Agricultural Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                Farm Weather Tips
              </h3>
              <Card>
                <div className="space-y-4">
                  {currentWeather && currentWeather.temperature > 85 && (
                    <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                      <ApperIcon name="AlertTriangle" size={16} className="text-red-600 mt-1" />
                      <div className="text-sm">
                        <p className="font-medium text-red-800">High Temperature Alert</p>
                        <p className="text-red-700">Consider extra watering for heat-sensitive crops.</p>
                      </div>
                    </div>
                  )}
                  
                  {currentWeather && currentWeather.precipitation > 70 && (
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <ApperIcon name="CloudRain" size={16} className="text-blue-600 mt-1" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-800">Rain Expected</p>
                        <p className="text-blue-700">Good time to skip irrigation. Check for drainage issues.</p>
                      </div>
                    </div>
                  )}
                  
                  {currentWeather && currentWeather.windSpeed > 15 && (
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <ApperIcon name="Wind" size={16} className="text-yellow-600 mt-1" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800">Windy Conditions</p>
                        <p className="text-yellow-700">Avoid spraying pesticides or fertilizers.</p>
                      </div>
                    </div>
                  )}
                  
                  {(!currentWeather || (currentWeather.temperature <= 85 && currentWeather.precipitation <= 70 && currentWeather.windSpeed <= 15)) && (
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <ApperIcon name="CheckCircle" size={16} className="text-green-600 mt-1" />
                      <div className="text-sm">
                        <p className="font-medium text-green-800">Good Conditions</p>
                        <p className="text-green-700">Perfect weather for most farm activities.</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                Weather Actions
              </h3>
              <Card>
                <div className="space-y-3">
                  <Button 
                    fullWidth 
                    variant="outline" 
                    icon="RefreshCw"
                    onClick={loadWeatherData}
                  >
                    Refresh Weather
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outline" 
                    icon="Bell"
                    onClick={() => alert('Weather alerts feature would be implemented here')}
                  >
                    Set Alerts
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outline" 
                    icon="MapPin"
                    onClick={() => alert('Location settings would be implemented here')}
                  >
                    Change Location
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;