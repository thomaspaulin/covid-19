import React from 'react';
// import GlobalMap from "./GlobalMapOpenLayers";
import GlobalMap from "./ChloroplethMap";
import { getLatestData } from '../../service/Time';
import ChloroplethMap from './ChloroplethMap';

const mapPalette = {
  0: "#00e1a1",
  10: "#5e8c41",
  100: "#ffd900",
  1000: "#e5660f",
  10000: "#be1e2d"
};

export default function OutbreakMap({data, date, selectionHandler}) {
  return (
    <ChloroplethMap
      palette={mapPalette}
      highlightColor="#121212"
      data={getLatestData(data, date)}
      selectionHandler={selectionHandler}
    ></ChloroplethMap>
  );
}
