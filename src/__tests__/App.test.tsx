import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import * as geocode from "../api/geocode";
import * as weather from "../api/weather";

describe("App Integration", () => {
  const mockForecast = [
    {
      date: "2025-08-01",
      minTemp: 65,
      maxTemp: 80,
      day: {
        temperature: 80,
        temperatureUnit: "F",
        shortForecast: "Sunny",
        detailedForecast: "Clear skies.",
      },
      night: {
        temperature: 65,
        temperatureUnit: "F",
        shortForecast: "Clear",
        detailedForecast: "Clear and cool.",
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows empty state on initial load", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.queryByText(/sunny/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/clear/i)).not.toBeInTheDocument();
  });

  it("fetches and displays forecast", async () => {
    vi.spyOn(geocode, "geocodeAddress").mockResolvedValue({
      lat: 38.8977,
      lon: -77.0365,
      formatted: "1600 Pennsylvania Ave NW, Washington, DC",
    });
    vi.spyOn(weather, "getWeather").mockResolvedValue(mockForecast);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    await userEvent.type(
      screen.getByPlaceholderText(/enter a u.s. address/i),
      "1600 Pennsylvania Ave NW",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /get forecast/i }),
    );

    await waitFor(() =>
      expect(screen.getByText(/fri, aug 1/i)).toBeInTheDocument(),
    );
    expect(screen.getByText("65° / 80°")).toBeInTheDocument();
    expect(screen.getByText(/sunny/i)).toBeInTheDocument();
    expect(screen.getByText(/clear/i)).toBeInTheDocument();
  });

  it("navigates to forecast detail page", async () => {
    vi.spyOn(geocode, "geocodeAddress").mockResolvedValue({
      lat: 38.8977,
      lon: -77.0365,
      formatted: "1600 Pennsylvania Ave NW, Washington, DC",
    });
    vi.spyOn(weather, "getWeather").mockResolvedValue(mockForecast);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    await userEvent.type(
      screen.getByPlaceholderText(/enter a u.s. address/i),
      "1600 Pennsylvania Ave NW",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /get forecast/i }),
    );
    await waitFor(() =>
      expect(screen.getByText(/fri, aug 1/i)).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole("link", { name: /fri, aug 1/i }));
    await waitFor(() =>
      expect(screen.getByText(/friday, august 1/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/high: 80° — low: 65°/i)).toBeInTheDocument();
    expect(screen.getByText(/clear skies/i)).toBeInTheDocument();
    expect(screen.getByText(/clear and cool/i)).toBeInTheDocument();
  });

  it("shows error when no match", async () => {
    vi.spyOn(geocode, "geocodeAddress").mockRejectedValue(
      new Error("No match found"),
    );
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    await userEvent.type(
      screen.getByPlaceholderText(/enter a u.s. address/i),
      "Invalid",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /get forecast/i }),
    );
    await waitFor(() =>
      expect(screen.getByText(/no match found/i)).toBeInTheDocument(),
    );
  });
});
