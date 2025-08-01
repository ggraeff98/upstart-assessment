import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import { getWeather } from "../api/weather";

vi.mock("axios");

describe("getWeather", () => {
  it("returns forecast data", async () => {
    (axios.get as any).mockResolvedValueOnce({
      data: [
        {
          name: "Monday",
          temperature: 70,
          temperatureUnit: "F",
          shortForecast: "Sunny",
        },
        {
          name: "Tuesday",
          temperature: 72,
          temperatureUnit: "F",
          shortForecast: "Cloudy",
        },
      ],
    });
    const forecast = await getWeather(38.8977, -77.0365);
    expect(Array.isArray(forecast)).toBe(true);
    expect(forecast[0].name).toBe("Monday");
    expect(forecast[0].temperature).toBe(70);
  });

  it("throws error when API/network error occurs", async () => {
    (axios.get as any).mockRejectedValueOnce(new Error("Network Error"));
    await expect(getWeather(38.8977, -77.0365)).rejects.toThrow(
      "Network Error",
    );
  });

  it("returns empty array or throws for malformed data", async () => {
    (axios.get as any).mockResolvedValueOnce({ data: undefined });
    const result = await getWeather(38.8977, -77.0365);
    expect(result).toBeUndefined();
  });
});
