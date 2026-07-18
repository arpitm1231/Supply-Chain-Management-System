// Static city -> lat/lng lookup used for mapping order routes onto the
// tracking map. Keys are matched case-insensitively (see getCoordinates).
const CITY_COORDINATES = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Surat: { lat: 21.1702, lng: 72.8311 },
  Nashik: { lat: 19.9975, lng: 73.7898 },
  Coimbatore: { lat: 11.0168, lng: 76.9558 },
  Gurgaon: { lat: 28.4595, lng: 77.0266 },
  Noida: { lat: 28.5355, lng: 77.391 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Chandigarh: { lat: 30.7333, lng: 76.7794 },
  Bhopal: { lat: 23.2599, lng: 77.4126 },
  Indore: { lat: 22.7196, lng: 75.8577 },
  Kochi: { lat: 9.9312, lng: 76.2673 },
};

const getCoordinates = (cityName = "") => {
  const key = Object.keys(CITY_COORDINATES).find(
    (c) => c.toLowerCase() === cityName.trim().toLowerCase()
  );
  return key ? CITY_COORDINATES[key] : null;
};

// Splits a "Origin to Destination" route string into resolved coordinates.
const resolveRoute = (route = "") => {
  const parts = route.split(/ to /i);
  if (parts.length !== 2) return null;
  const [originCity, destinationCity] = parts.map((p) => p.trim());
  const origin = getCoordinates(originCity);
  const destination = getCoordinates(destinationCity);
  if (!origin || !destination) return null;
  return { originCity, destinationCity, origin, destination };
};

module.exports = { CITY_COORDINATES, getCoordinates, resolveRoute };
