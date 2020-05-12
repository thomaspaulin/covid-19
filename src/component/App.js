import React, { useState, useEffect } from "react";
import "./App.css";

import ChloroplethMap from "./map/ChloroplethMap";
import InformationDrawer from "./information-drawer/InformationDrawer";
import SocialLinks from "./social/SocialLinks";
import LoadingDialog from "./loading/LoadingDialog";
import { getLatestData } from "../service/Time";
import { outbreakData } from "../service/OubreakData";
import { geojson as geojsonStore } from "../service/GeoJSON";
import { transformHGISCOVID19Data } from "../service/DataProcessor";

const mapPalette = {
  0: "#99B898",
  1: "#FECEAB",
  1000: "#FF847C",
  10000: "#E84A5F"
};

const valueProperty = "outbreak";

// todo fix the effects so nulls won't be passed into components
const setupDataForTesting = function(geojson, globalData, setGeoJson) {
  if (!geojson) {
        geojsonStore.retrieve()
        .then(response => {
          const json = response.data;
          json.features.forEach(feature => {
            const countryData = globalData[feature.properties.iso_a3];
            if (countryData) {
              feature.properties[valueProperty] = countryData.cases;
            }
          });
          console.log("Geo JSON fetched");
          setGeoJson(json);
        })
        .catch(err => console.error(err));
  }
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const [mapData, setMapData] = useState(null);
  useEffect(() => {
    if (!mapData) {
      outbreakData.retrieve().then((csv) => {
        transformHGISCOVID19Data(csv.data)
        .then(data => setMapData(data));
      });
    }
  }, [mapData]);

  const [globalData, setGlobalData] = useState(null);
  useEffect(() => {
    const data = getLatestData(mapData, new Date());
    setGlobalData(data);
  }, [mapData]);

  const [selection, setSelection] = useState(null);
  const [countryData, setCountryData] = useState(null);

  const selectionHandler = function(feature) {
    const selectedCountry = {
      id: feature.properties.iso_a3,
      alpha2: feature.properties.iso_a2,
      name: feature.properties.name
    };

    setSelection(selectedCountry);
    setCountryData(globalData[selectedCountry.id]);
  };

  const [geojson, setGeoJson] = useState(null);
  useEffect(() => {
    if (globalData && !geojson) {
      setupDataForTesting(geojson, globalData, setGeoJson);
    }
  }, [geojson, globalData]);

  useEffect(() => {
    if (geojson) {
      console.log("Has Map Data");
      setIsLoading(false);
    }
  },
  [geojson]);

  return (
    <div className="App">
      <LoadingDialog
        isLoading={isLoading}
      ></LoadingDialog>
      <InformationDrawer
        title="COVID-19 Distribution"
        selectedCountry={selection}
        countryData={countryData}
      ></InformationDrawer>
      <ChloroplethMap
        palette={mapPalette}
        valueProperty={valueProperty}
        highlightColor="#2a363b"
        geojson={geojson}
        selectionHandler={selectionHandler}
      ></ChloroplethMap>
      <SocialLinks
        website="https://thomaspaulin.me"
        github="thomaspaulin"
        twitter="thomaspaulinNZ"
      ></SocialLinks>
    </div>
  );
}
