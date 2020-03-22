import { createStorage } from "./Cache";

async function fetchLocal() {
  return fetch(`${process.env.PUBLIC_URL}/countries.geojson`)
      .then(res => res.json());
}

export const geojson = createStorage("geojson", fetchLocal, (x) => true);