

I tried to keep the site small because there's no need for a map and some data to require an entire single page application framework but it turns out writing custom web components, for cleaner code, is quite complex and React, etc. make it simpler to use them instead, even if they are much heavier than this application needs


The data will be fetched on the page load because the dataset is still relatively small and fixed. This reduces the asynchronicity of it a bit and gives a better experience for the user

In order to achieve a single component for displaying country cases global data will be considered its own country


Vector layers using geoJSON to draw the countries. GeoJSON from https://geojson-maps.ash.ms/   https://openlayers.org/en/latest/examples/vector-layer.html

Discovered react hooks and tried to begin oimplementong them.
Open Layers manipulates the DOM directly and I've found it doesn't play nice with React hooks. Because I got carried away with the visuality of the map, I tried to learn about react hooks, and deal with open layers being difficult at the same time rather than get the hang of hooks on a simpler component first. 

I am experimenting with Leaflet to see how that compares. Initial impressions are much more positive, but I need to consider that I know know more of the domain specific knowledge compared with when I was trying Open Layers

I learned that a Chloropleth map is what I'm after.

To bring labels on top https://leafletjs.com/examples/map-panes/ - they don't work well though. Ideally the labels would be ommitted from the tiles and in their own layer but instead the labels are pre-rendered into the tiles by open street map

got a dummy working with (slow) colours for the countries. Adding react leaflet because I hope it will tidy up the code a bit. Initial impressions are that it help to reduce much of where the complexity is. Instead I will be investigating ways to create re-usable functions which encapsulate what is currently in the use effect blocks such as the geo JSON. This should allow smoother change detection.
I also would like to move to applying the data directly onto the features when the geo json layer is initialised, or the data changes. My current set up, which has come about from following examples, has everything in a single component who has many more than a single concern.
I will also investigate using the react-leaflet library with React classes, instead of hooks. Maybe that will allow for cleaner code and better use of components. They can then be replaced with functions and hooks later as required. react-leaflet does have its own issues, however, with geojson layers not updating when the data is updated. Apparently the solution is to provide a key function which will change but I have not yet confirmed this.

Ended up sticking to my guns because I now understand how my code works more than the others, and checking for an update in react class components require more reading. Leaflet-chloropleth didn't seem to play nice with my hover and select handlers either. 

[Fully embracing hooks](https://usehooks.com/) tends to make the code cleaner than an in-between state. The cleanest way to mix hooks and code which interacts directly with the DOM as map libraries so remains to be seen 

##Components
- Map
    - map itself
    - controls
    - legend
- Information drawer
    - drawer footer
- Graph(s)
- Country information
- social buttons


Turns out PDF parsing is difficult and not a matter of parsing text, instead maybe methods use OCR and specific pixels. In order to save time I will be forgoing this method for now - the coordinates are not the same across date, with the table getting larger each time a new country is added. This in turn changes the coordinates for each day. Instead I will be using the data that a team from the [Humanistic GIS Laboratory at the University of Washington](https://hgis.uw.edu/) has already [made available](https://github.com/jakobzhao/virus) and adjusting it to suit my needs. Their data, however, provides varying levels of granularity across the world, meaning the USA, Canada, and China are split up into states/provinces and territories/prefectures which does not fit my model. This could be solved but causes yet more headaches, and so I need to build my own data scrapers and take ownership of the data once I've ironed out the display kinks.


This project spun off a mini one in its own right which is to serve the ISO-3166 country codes as a standalone API. I'll be taking this opportunity to learn more about AWS, even as its marketshare is decreasing, because I only have a basic level of familiarity. As I experiment I am using the AWS free tier which means the data store will be using DynamoDB and it will be served using Lambda.

This mini project will be serving the ISO-3166-1 and ISO-3166-2 codes, the country and country subdivision codes via JSON. It will also have an endpoint which clients can use to check if they need to update, this is because these codes change extremely rarely (but do change) and so it's more performant to use a cached copy with a simple request to check whether an update is required. When things are setup more I will provide a notion of versioning so that the update can be done like a PATCH request would, only from the server to the client rather than vice versa.

I am splitting the code into two tables: one for ISO-3166-1 codes, the country codes; and one for ISO-3166-2 codes, the country subdivision codes. 
Primary keys:
 - -1 codes: the alpha-3 code will be used because that's what the map libraries I've seen so far use as identifiers
 - -2 codes: the code will be used as an index, but a partitioning key will be added based on country because these codes represent country subdivisions
 
 Indexing using the alpha-3 code, however, would make finding subdivisions less optimal because all subdivisions begin with the country's alpha-2 code. I will instead rely on instead baking in the data format and using the country/subdivision names.

 I found myself straying more and more off course so I pulled myself back onto the piste and set up grouping of the region data into countries. This meant I would have something working which I could serve up to the public. In the process of testing everything with live data links, I was reminded I hadn't accounted for CORS yet because I have been using data offered by the University of Washington's HGIS I do not have access to the server. Because I lack access to the server I cannot set up the headers required to mitigate CORS. The next option is to use a proxy which normally requires a server, something I'm not willing to do, however, I discovered https://cors-anywhere.herokuapp.com/ which serves the purpose, and without setup required.

 My colours weren't providing sufficient contrast with the ocean blue so I used a darker blue. This created a dark mode feel which I have decided to fully embrace and I styled the map controls accordingly.

 The intention of this project was to practice designing something which could have some actual use, and would be QUICK. To add all the functionality to take further, make it more stable, etc, would be the 20% which takes 80% of the time, and thus I'm considering the MVP done.