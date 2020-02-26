import React from "react";

export function CountryCases({cases}) {
  let total = cases ? cases : 0
  return (
    <div className="cases-container">
      <div className="confirmed-cases">
        {total}
      </div>
    </div>
  );
}
