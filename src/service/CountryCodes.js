import { createStorage } from './Cache';

const STORAGE_KEY = "countryCodes";
const SUBDIVISION_KEY = "subdivisionCodes";
// const ISO3166_1_URL = "todo/countries-codes/";
// const ISO3166_2_URL = "todo/subdivision-codes/";
// const UPDATE_CHECK_URL = "todo/update-check/"

async function fetchCountryCodes() {
    return fetch('http://localhost:3000/countrycodes.json')
        .then(res => res.json());
}

async function fetchSubdivisonToCountryMappings() {
    return fetch('http://localhost:3000/countryregioncodes.json')
        .then(res => res.json());
}

// async function fetchCountryCodes() {
//     return Promise.all([
//         fetch(ISO3166_1_URL).then(r => r.json()),
//         fetch(ISO3166_2_URL).then(r => r.json())
//     ])
//     .then(([countries, regions]) => {
//         return {
//             "iso_3166-1": countries,
//             "iso_3166-2": regions,
//             "lastUpdated": moment.toISOString()
//         };
//     })
//     .catch(err => console.error(err));
// }

// async function isUpdateRequired(lastUpdated) {
//     const req = new Request(UPDATE_CHECK_URL, {
//         method: 'HEAD',
//         headers: {
//             // I don't want the cache expiry headers because I expect this to rarely change/on the order of momnths to years.
//             // Explicitly ask for an update otherwise, but cache the update request to be one per day
//             // todo rephrase this comment better
//             "Last-Updated": lastUpdated.toISOString()
//         },
//     });
//     return fetch(req)
//         .then(response => {
//             return response.headers().has("Update-Required");
//         })
//         .catch(err => console.error(err));
// }

export const countryCodes = createStorage(STORAGE_KEY, fetchCountryCodes, (x) => true);
export const countriesSubdivisionBelongTo = createStorage(SUBDIVISION_KEY, fetchSubdivisonToCountryMappings, (x) => true);