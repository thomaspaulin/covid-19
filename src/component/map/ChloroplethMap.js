import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./ChloroplethMap.css";

function getColor(palette, count) {
  const bands = Object.keys(palette);
  bands.sort((a, b) => parseFloat(b) - parseFloat(a));
  let band = 0;
  for (let b of bands) {
    // include the lower value of band A.K.A 0-99, 100-199 vs. 0-100, 101-200
    if (count >= b) {
      band = b;
      break;
    }
  }
  return palette[band];
}

function styleFeature(feature, palette, valueProperty) {
  const color = getColor(palette, feature.properties[valueProperty]);
  return {
    fillColor: color,
    fillOpacity: 0.6,
    color: color,
    opacity: 0.7,
    weight: 1,
    dashArray: "2"
  };
}

function highlightFeature(e, highlightColor) {
  const layer = e.target;

  layer.setStyle({
    fillColor: highlightColor,
    fillOpacity: 0.5,
    color: highlightColor,
    weight: 2
  });

  // According to the leaflet tutorial these browsers don't like this bring to front function
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

function resetHighlighting(e, geoJSONLayer) {
  if (geoJSONLayer) {
    geoJSONLayer.resetStyle(e.target);
  }
}

// todo add chroma.js scale because leaflet-chloropleth
export default function ChloroplethMap({
  geojson,
  palette,
  valueProperty,
  highlightColor,
  selectionHandler
}) {
  // Setting up the Map
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [0, 0],
        zoom: 3,
        zoomControl: false,
      });
      mapRef.current.addControl(L.control.zoom({ position: "topright" }));
      mapRef.current.attributionControl.addAttribution('<a href="https://hgis.uw.edu/virus/">Data by the University of Washington HGIS Laboratory</a>');
    }
  }, [mapRef]);

  // Geo JSON
  const geoJSONLayerRef = useRef(null);
  useEffect(() => {
    if (geojson && mapRef.current && !geoJSONLayerRef.current) {
      geoJSONLayerRef.current = L.geoJSON(geojson, {
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: e => highlightFeature(e, highlightColor),
            mouseout: e => resetHighlighting(e, geoJSONLayerRef.current),
            click: e => selectionHandler(e.target.feature)
          });
        },
        style: feature => styleFeature(feature, palette, valueProperty)
      });
      geoJSONLayerRef.current.addTo(mapRef.current);
    }
  }, [
    geojson,
    mapRef,
    palette,
    highlightColor,
    valueProperty,
    selectionHandler
  ]);

  return <div id="map"></div>;
}
