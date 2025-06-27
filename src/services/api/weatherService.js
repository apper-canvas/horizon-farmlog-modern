import weatherData from '@/services/mockData/weather.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const weatherService = {
  async getCurrentWeather() {
    await delay(500);
    return { ...weatherData.current };
  },

  async getForecast() {
    await delay(400);
    return [...weatherData.forecast];
  },

  async getAlerts() {
    await delay(300);
    return [...weatherData.alerts];
  }
};