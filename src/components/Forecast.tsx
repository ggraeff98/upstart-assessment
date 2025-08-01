import { Link } from "react-router-dom";

type TemperatureData = {
  temperature: 80;
  temperatureUnit: "F";
  shortForecast: "Sunny";
  detailedForecast: "Clear skies.";
};

type ForecastDay = {
  date: string;
  minTemp: number;
  maxTemp: number;
  day?: TemperatureData;
  night?: TemperatureData;
};

export default function Forecast({ forecast }: { forecast: ForecastDay[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {forecast.map((day) => {
        const date = new Date(day.date);
        return (
          <Link
            key={day.date}
            to={`/forecast/${day.date}`}
            state={{ day }}
            className="bg-white border border-brand-200 rounded-2xl shadow-lg p-5 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <h3 className="text-lg font-bold text-brand-700">
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </h3>
            <div className="mt-2 text-xl font-semibold text-brand-600">
              {day.minTemp}° / {day.maxTemp}°
            </div>
            <p className="text-sm text-brand-500 mt-1">
              {day.day?.shortForecast || "—"} (Day)
            </p>
            <p className="text-sm text-brand-400">
              {day.night?.shortForecast || "—"} (Night)
            </p>
          </Link>
        );
      })}
    </div>
  );
}
