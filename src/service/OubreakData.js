import Papa from 'papaparse';
import { createStorage } from './Cache';

const OUTBREAK_KEY = "outbreak";

async function fetchOutbreakData(url) {
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  return new Promise((resolve, reject) => {
    Papa.parse(proxyurl + url, {
        download: true,
        delimiter: ",",
        newline: "\n",
        skipEmptyLines: true,
        complete: function (results, file) {
            resolve(results.data)
          },
        error: function (err, file) {
            reject(err)
        }
      });
  });
}

async function fetchData() {
    return fetchOutbreakData("http://hgis.uw.edu/virus/assets/virus.csv");
}

export const outbreakData = createStorage(OUTBREAK_KEY, fetchData, (x) => true);
