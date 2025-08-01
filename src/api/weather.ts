import axios from "axios";

export async function getWeather(lat: number, lon: number) {
  const dailyForecast = await axios.get("/api/weather", {
    params: { lat, lon },
  });

  return dailyForecast.data;
}
