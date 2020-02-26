export function dateAsString(date) {
        // The WHO reports are posted end of day in European time, hence everything will be UTC until the very last step possible
        return date.toISOString().substring(0, 10);
    }

export function getLatestData(dataKeyedByDate, date) {
    const dateString = dateAsString(date);
    
    if (!dataKeyedByDate) {
        return undefined;
    } else if(dataKeyedByDate[dateString]) {
        // today is the latest data, if it's available
        return dataKeyedByDate[dateString];
    }

    const datesPresentInData = Object.keys(dataKeyedByDate);
    datesPresentInData.sort(function(a,b) {
        return b.localeCompare(a);
    });
    return dataKeyedByDate[datesPresentInData[0]];
}