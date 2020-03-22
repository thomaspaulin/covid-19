import React from "react";
import "./CountryData.css";

export function CountryData({ title, type, count }) {
  let total = count ? count : 0;
  let classes = `country-data-container ${type}`;
  return (
    <div className={classes}>
      {title}
      <div>{total}</div>
    </div>
  );
}
