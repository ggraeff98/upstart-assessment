import axios from "axios";

export type GeocodeResponse = {
  result: {
    addressMatches: {
      coordinates: { x: number; y: number };
      matchedAddress: string;
    }[];
  };
};

export async function geocodeAddress(address: string) {
  const response = await axios.get("/api/geocode", {
    params: { address, benchmark: 4, format: "json" },
  });

  const match = response.data;
  if (!match) throw new Error("No match found for the address");

  return {
    lat: match.coordinates.y,
    lon: match.coordinates.x,
    formatted: match.matchedAddress,
  };
}
