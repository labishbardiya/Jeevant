type HeatPoint = { lat: number; lon: number; intensity: number };

const CITY_COORDS: Record<string, [number, number]> = {
  jaipur: [26.9124, 75.7873],
  delhi: [28.6139, 77.209],
  mumbai: [19.076, 72.8777],
  bengaluru: [12.9716, 77.5946],
  kolkata: [22.5726, 88.3639],
  chennai: [13.0827, 80.2707],
  hyderabad: [17.385, 78.4867],
  pune: [18.5204, 73.8567],
  lucknow: [26.8467, 80.9462],
  indore: [22.7196, 75.8577],
};

export const INDIA_CENTER: [number, number] = [78.9629, 22.5937];
export type { HeatPoint };

export function coordinateForCity(city: string | undefined, idx = 0): [number, number] | null {
  if (!city) return null;
  const key = city.toLowerCase().trim();
  const base = CITY_COORDS[key];
  if (!base) return null;
  const offset = idx * 0.01;
  return [base[1] + offset, base[0] + offset];
}
