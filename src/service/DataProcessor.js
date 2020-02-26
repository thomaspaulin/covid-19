import {
  countryCodes as code,
  countriesSubdivisionBelongTo
} from "./CountryCodes";

// todo run through and build the region data once then run through at the end to tally up - regions mean there will be multiple entries per country

function parseRegionData(data) {
  /*
  According to the folks who created the data I'm currently using:
  In the data table, each entry indicates the infection status in the format of "#-#-#-#" -- a 4-sequel entry divided by dashes. 
  The first sequel represents the number of confirmed cases, 
  the second sequel represents suspected cases, 
  the third sequel represents cured cases, 
  the fourth sequel represents death cases.
  */
  const readings = data.split("-");
  return {
    cases: readings[0] | 0,
    recoveries: readings[2] | 0,
    deaths: readings[3] | 0
  };
}

export async function transformHGISCOVID19Data(csvData) {
  // todo clean up this function and put country codes in local storage
  const countryAndSubdivisionCodes = await code.retrieve();
  const subdivisionToCountryMappings = await countriesSubdivisionBelongTo.retrieve();
  const countryCodes = countryAndSubdivisionCodes.data["iso_3166-1"];
  const cols = csvData[0];
  const covid19Data = {};

  for (let i = 1; i < csvData.length; i++) {
    const fileRow = csvData[i];
    const row = {};
    const date = fileRow[0];
    if (date) {
      for (let j = 1; j < fileRow.length; j++) {
        // the USA, Canada, and China are more granular than a country level and this is causing problems with the geojson which is a country level only
        
        const region = await parseRegion(cols[j], countryCodes, subdivisionToCountryMappings.data);
        // const region = countryCodes[cols[j]]
        //   ? countryCodes[cols[j]]["alpha3"]
        //   : undefined;

        if (region) {
          const todayData = parseRegionData(csvData[i][j]);

          if (!row[region]) {
            row[region] = {
              cases: todayData.cases | 0,
              recoveries: todayData.recoveries | 0,
              deaths: todayData.deaths | 0
            };
          } else {
            let temp = row[region];
            temp.cases += todayData.cases | 0;
            temp.recoveries += todayData.recoveries | 0;
            temp.deaths += todayData.deaths | 0;
            row[region] = temp;
          }
        }
      }
      covid19Data[date] = row;
    }
  }
  return covid19Data;
}

async function parseRegion(name, countryCodes, subdivisionToCountryMappings) {
  if (countryCodes[name]) {
    return countryCodes[name]["alpha3"]
  } else if (subdivisionToCountryMappings[name]) {
    return subdivisionToCountryMappings[name];
  } else {
    return undefined;
  }
}
