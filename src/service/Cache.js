import moment from "moment";
import * as storage from './Storage';


async function _retrieve(storageKey, fetchFn, invalidationCheckFn) {
    const isStorageEmpty = !storage.local.getItem(storageKey);
    let isFetchRequired = isStorageEmpty;
    
    if (!isStorageEmpty) {
        let lastUpdated = storage.local.getItem(storageKey).lastUpdated
        if(!lastUpdated) {
            lastUpdated = moment().utc();
        }
        isFetchRequired |= await invalidationCheckFn(lastUpdated);
    }

    if (isFetchRequired) {
        const fetchedData = await fetchFn();
        try {
            if (fetchedData) {
                const data = {
                    lastUpdated: moment().utc().toISOString(),
                    data: fetchedData
                };
                storage.local.setItem(storageKey, JSON.stringify(data));
            } else {  
                // throwing an error here suppresses actual errors
            }
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                console.error("Error when saving data. I'll have to fetch each time :(");
                return fetchedData;
            } else {
                throw e;
            }
        }
    }

    return JSON.parse(storage.local.getItem(storageKey));
}

/**
 * 
 * @param {string} storageKey used for cache storage. Must be unique
 * @param {Promise} fetchFn the function used to download data. Must be an asynchronous function which returns exactly the data to be stored
 * @param {Promise} invalidationCheckFn the function used to determine whether the cache should be invalidated and new data downloaded. 
 *                                      Must be a function which accepts an ISO 2020-03-13T12:21:33Z datetime.
 */
export function createStorage(storageKey, fetchFn, invalidationCheckFn) {
    return {
        retrieve: () => {
            return _retrieve(storageKey, fetchFn, invalidationCheckFn);
        }
    }
}