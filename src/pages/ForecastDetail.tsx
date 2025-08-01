import { useLocation, useParams, Link } from "react-router-dom";

export default function ForecastDetail({ forecast }: { forecast: any[] }) {
  const { dayDate } = useParams<{ dayDate: string }>();
  const location = useLocation();
  const day = location.state?.day || forecast.find((f) => f.date === dayDate);

  if (!day) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">Forecast not found.</p>
        <Link to="/" className="text-brand-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const date = new Date(day.date);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-brand-700 mb-4">
        {date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </h2>
      <p className="text-lg text-brand-600 mb-6">
        High: {day.maxTemp}° — Low: {day.minTemp}°
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daytime */}
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 shadow">
          <h3 className="font-semibold text-brand-700 mb-2">Day</h3>
          {day.day ? (
            <>
              <p className="text-3xl font-bold text-brand-600">
                {day.day.temperature}°{day.day.temperatureUnit}
              </p>
              <p className="mt-2 text-brand-500">{day.day.shortForecast}</p>
              <p className="mt-2 text-gray-600">{day.day.detailedForecast}</p>
            </>
          ) : (
            <p className="text-gray-500">No day forecast available.</p>
          )}
        </div>

        {/* Nighttime */}
        <div className="bg-brand-100 border border-brand-300 rounded-xl p-4 shadow">
          <h3 className="font-semibold text-brand-700 mb-2">Night</h3>
          {day.night ? (
            <>
              <p className="text-3xl font-bold text-brand-600">
                {day.night.temperature}°{day.night.temperatureUnit}
              </p>
              <p className="mt-2 text-brand-500">{day.night.shortForecast}</p>
              <p className="mt-2 text-gray-600">{day.night.detailedForecast}</p>
            </>
          ) : (
            <p className="text-gray-500">No night forecast available.</p>
          )}
        </div>
      </div>

      <Link
        to="/"
        className="mt-8 inline-block bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg shadow transition"
      >
        Back to Forecast
      </Link>
    </div>
  );
}
