import React from "react";
import { CountryData } from "../country-data/CountryData";

import "./InformationDrawer.css";

const defaultCountryMsg = "Click on a country";

function getFieldValue(selectedCountry, countryData, attr) {
  if (selectedCountry && countryData) {
    return countryData[attr] | 0;
  } else if (selectedCountry && !countryData) {
    return 0;
  } else {
    return "-";
  }
}

export default function InformationDrawer({
  title,
  selectedCountry,
  countryData
}) {
  let cases, recoveries, deaths;

  const name =
    selectedCountry && selectedCountry.name
      ? selectedCountry.name
      : defaultCountryMsg;

  cases = getFieldValue(selectedCountry, countryData, "cases");
  deaths = getFieldValue(selectedCountry, countryData, "deaths");
  recoveries = getFieldValue(selectedCountry, countryData, "recoveries");

  let flagEmoji;
  if (selectedCountry && selectedCountry.alpha2) {
    flagEmoji = (
      <i className={`em em-flag-${selectedCountry.alpha2.toLowerCase()}`}></i>
    );
  }

  return (
    <div className="box drawer-wrapper">
      <h2 className="drawer-title">{title}</h2>
      <div className="country-header">
        {flagEmoji}
        <h2>{name}</h2>
      </div>
      <div className="cases-wrapper">
        <CountryData 
          title="Cases" 
          type="cases" 
          count={cases}></CountryData>
        <CountryData
          title="Recoveries"
          type="recoveries"
          count={recoveries}
        ></CountryData>
        <CountryData 
          title="Deaths" 
          type="deaths" 
          count={deaths}></CountryData>
      </div>
      <div className="drawer-filler"></div>
      <div className="drawer-footer">
        <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public">
          Protect yourself
        </a>
      </div>
    </div>
  );
}
