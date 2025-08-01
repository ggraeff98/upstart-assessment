import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import { geocodeAddress } from "../api/geocode";

vi.mock("axios");

describe("geocodeAddress", () => {
  it("returns lat/lon for valid address", async () => {
    (axios.get as any).mockResolvedValueOnce({
      data: {
        coordinates: { x: -77.0365, y: 38.8977 },
        matchedAddress: "1600 PENNSYLVANIA AVE NW, WASHINGTON, DC",
      },
    });

    const result = await geocodeAddress(
      "1600 Pennsylvania Ave NW, Washington, DC",
    );
    expect(result).toEqual({
      lat: 38.8977,
      lon: -77.0365,
      formatted: "1600 PENNSYLVANIA AVE NW, WASHINGTON, DC",
    });
  });

  it("throws error when no match found", async () => {
    (axios.get as any).mockResolvedValueOnce({
      data: null,
    });
    await expect(geocodeAddress("Invalid Address")).rejects.toThrow(
      "No match found",
    );
  });

  it("throws error when API/network error occurs", async () => {
    (axios.get as any).mockRejectedValueOnce(new Error("Network Error"));
    await expect(
      geocodeAddress("1600 Pennsylvania Ave NW, Washington, DC"),
    ).rejects.toThrow("Network Error");
  });

  it("throws error when response is missing fields", async () => {
    (axios.get as any).mockResolvedValueOnce({
      data: { coordinates: undefined, matchedAddress: undefined },
    });
    await expect(
      geocodeAddress("1600 Pennsylvania Ave NW, Washington, DC"),
    ).rejects.toThrow();
  });
});
