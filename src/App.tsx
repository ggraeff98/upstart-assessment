import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AddressForm, { AddressFormData } from "./components/AddressForm";
import Forecast from "./components/Forecast";
import ForecastDetail from "./pages/ForecastDetail";
import { geocodeAddress } from "./api/geocode";
import { getWeather } from "./api/weather";
import ForecastSkeleton from "./components/Forecast/ForecastSkeleton";

export default function App() {
  const [forecast, setForecast] = useState<[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastAddress, setLastAddress] = useState<AddressFormData | undefined>(
    undefined,
  );
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);

  async function handleAddressSubmit(addressForm: AddressFormData) {
    setLastAddress(addressForm);
    setIsLoadingForecast(true);
    setError(null);

    try {
      const { lat, lon } = await geocodeAddress(addressForm.address);
      const forecastData: any = await getWeather(lat, lon);
      setForecast(forecastData.slice(0, 7));
    } catch (err: any) {
      setError("No match found for the address");
      setForecast([]);
    } finally {
      setIsLoadingForecast(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-extrabold text-center text-brand-700 mb-8 drop-shadow">
          7-Day Weather Forecast
        </h1>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <AddressForm
                  onSubmit={handleAddressSubmit}
                  initialData={lastAddress}
                />
                {error && !isLoadingForecast && (
                  <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mt-4 text-center">
                    {error}
                  </p>
                )}
                {forecast.length > 0 && !isLoadingForecast && (
                  <Forecast forecast={forecast} />
                )}
                {isLoadingForecast && <ForecastSkeleton />}
              </>
            }
          />
          <Route
            path="/forecast/:dayDate"
            element={<ForecastDetail forecast={forecast} />}
          />
        </Routes>
      </div>
    </div>
  );
}
