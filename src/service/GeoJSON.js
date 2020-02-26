import { createStorage } from "./Cache";

async function fetchLocal() {
  return fetch('http://localhost:3000/countries.geojson')
      .then(res => res.json());
}

export const geojson = createStorage("geojson", fetchLocal, (x) => true);