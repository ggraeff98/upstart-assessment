import axios, { AxiosResponse } from "axios";
import express, { Request, Response } from "express";
import fs from "node:fs/promises";
import { ViteDevServer } from "vite";

const isProduction = process.env.NODE_ENV === "production";
const port: number = Number(process.env.PORT) || 5173;
const base: string = process.env.BASE || "/";

const templateHtml: string = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

const app = express();

app.use(express.json());

let vite: ViteDevServer | undefined;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

app.get("/api/weather", async (req: Request, res: Response) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (isNaN(lat) || isNaN(lon)) {
      return res
        .status(400)
        .json({ error: "lat and lon query params required" });
    }

    const pointResp: AxiosResponse<PointResponse> = await axios.get(
      `https://api.weather.gov/points/${lat},${lon}`,
    );
    const forecastUrl = pointResp.data.properties.forecast;

    const forecastResp: AxiosResponse<ForecastResponse> =
      await axios.get(forecastUrl);

    const periods = forecastResp.data.properties.periods;

    const grouped: Record<
      string,
      { day?: ForecastPeriod; night?: ForecastPeriod }
    > = {};

    for (const p of periods) {
      const dateKey = new Date(p.startTime).toISOString().split("T")[0];
      const isNight =
        p.name.toLowerCase().includes("night") ||
        p.name.toLowerCase().includes("overnight");
      if (!grouped[dateKey]) grouped[dateKey] = {};
      if (isNight) grouped[dateKey].night = p;
      else grouped[dateKey].day = p;
    }

    const dailyForecast: DailyForecast[] = Object.entries(grouped).map(
      ([date, entries]) => {
        const minTemp = entries.night?.temperature ?? entries.day?.temperature;
        const maxTemp = entries.day?.temperature ?? entries.night?.temperature;

        return {
          date,
          minTemp,
          maxTemp,
          day: entries.day,
          night: entries.night,
        };
      },
    );

    res.json(dailyForecast);
  } catch (err: any) {
    console.error("Weather API error:", err.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("/api/geocode", async (req: Request, res: Response) => {
  try {
    const address = String(req.query.address || "");

    if (!address) {
      return res.status(400).json({ error: "address query param required" });
    }

    const url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress`;
    const response: AxiosResponse<GeoResponse> = await axios.get(url, {
      params: { address, benchmark: 4, format: "json" },
    });

    const match = response.data.result.addressMatches[0];
    if (!match) {
      return res.status(404).json({ error: "No match found for the address" });
    }

    res.json(match);
  } catch (err: any) {
    console.error("Geocode API error:", err.message);
    res.status(500).json({ error: "Failed to fetch geocode data" });
  }
});

app.use("*all", async (req: Request, res: Response) => {
  try {
    const url = req.originalUrl.replace(base, "");

    let template: string;
    let render: (url: string) => Promise<{ head?: string; html?: string }>;

    if (!isProduction) {
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite!.transformIndexHtml(url, template);
      render = (await vite!.ssrLoadModule("/src/entry-server.jsx")).render;
    } else {
      template = templateHtml;

      render = (
        (await import("./server/entry-server.js" as any)) as {
          render: (...args: any[]) => any;
        }
      ).render;
    }

    const rendered = await render(url);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "");

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e: any) {
    vite?.ssrFixStacktrace(e);
    console.error(e.stack);
    res.status(500).end(e.stack);
  }
});

app.listen(port, () => {});

type PointResponse = {
  properties: { forecast: string };
};

type ForecastPeriod = {
  name: string;
  startTime: string;
  temperature: number;
};

type ForecastResponse = {
  properties: { periods: ForecastPeriod[] };
};

type DailyForecast = {
  date: string;
  minTemp: number | undefined;
  maxTemp: number | undefined;
  day?: ForecastPeriod;
  night?: ForecastPeriod;
};

type GeoResponse = {
  result: {
    addressMatches: Array<{
      matchedAddress: string;
      coordinates: { x: number; y: number };
    }>;
  };
};
