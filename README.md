# COVID-19 Distribution Map

This project is intended to give me some experience developing in React, whilst making something which also has use beyond the standard beginner applications such as a to-do app. I also wanted to investigate geospatial libraries and data in Javascript seeing as many other ideas I have revolve around geospatial data.

This project log can also be viewed on my [blog](https://blog.thomaspaulin.me/2020/03/covid-19-distribution/).

## Running, Testing, and Building

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Run

In the project directory, you can run:
`npm start`

Runs a development server. View the app at [http://localhost:3000](http://localhost:3000) in your browser.

### Tests

In the project directory, you can run:
`npm test`

The automated test suite has not yet been completed, however, as I was learning everything as I went and did not decide to take a test driven approach.

### Building for Production

`npm run build`

## Build Log

### Entry 1

I intended to keep the app to the minimum possible size, both in bytes, and in complexity because I felt there's no need for a map visualisation to require an entire [single page application](https://medium.com/@NeotericEU/single-page-application-vs-multiple-page-application-2591588efe58) framework. Instead it turns out writing custom web components to provide clear responsibility boundaries and separation of concerns is more [complex](https://developer.mozilla.org/en-US/docs/Web/Web_Components) than in some frameworks, enter [React](https://reactjs.org/). For this project React struck an optimal balance between being [minimal and unopinionated](https://reactjs.org/docs/getting-started.html#try-react), and providing custom components. The React scripts from the [create-react-app project](https://github.com/facebook/create-react-app) also provided a working out-of-the-box configuration for [webpack](https://webpack.js.org/), [eslint](https://eslint.org/), and other tooling, simplifying the setup.

#### Components

I'll be decomposing the app into the following components:

- Map
  - the map itself
  - controls - initial just zoom
  - legend
- Information drawer
  - title (simply a h2)
  - per country data x 3, one for each of confirmed cases, reported recoveries, and deaths
  - footer
- Graph(s) (I decided not to bother with graphs after all)
- Social buttons/links

### Entry 2

The [World Health Organisation (WHO)](https://www.who.int/) only updates their sitation reports once per day so it doesn't make sense to fetch more than once per day. I will assume users won't be leaving the page open for long periods of time, an assumption I have not fact checked but my observations of how people use their tabs suggests only those who are "serial tab openers" are likely to leave the map open for longer peiords. Because the dataset is still small in the whole scheme of things, I can reduce complexity, and fetch the data on initial load. If necessary a mechanism which checks for new data, such as a web worker or by polling, could be implemented later on.

### Entry 3

Going into this project I thought drawing country polygons would be a core functionality for mapping libraries. Through my research I've discovered this to be only partly true - country polygons can indeed be drawn by using [geojson features](https://geojson.org/), but geojson features are a generic means to represent any features on the map.

[Open Layers](https://openlayers.org/) and [Leaflet](https://leafletjs.com/) were recommended by folks on Stack Exchange. I chose to try Open Layers simply because I had looked at Leaflet in the past (for all of 30 minutes). There was no technical reason for the choice if I'm being perfectly honest.

In Open Layers the [vector layer](https://openlayers.org/en/latest/examples/vector-layer.html) is used with the geojson features to draw country polygons. I've opted for a [50m resolution](https://geojson-maps.ash.ms/) for my features seeing as country level data doesn't need ultra fine resolution (which is also significantly larger in file size), but 110m resolution is not precise enough. At 110m resolution the boundaries feel very alien and degrade the user experience, in my opinion.

### Entry 4

Taking a class-based approach is possible, but not recommended it turns out. I have discovered the React team [encourage using](https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both) [hooks](https://usehooks.com/) now. As I transitioned over to hooks and have discovered that because Open Layers manipulates the DOM directly you don't end up gaining the benefit of hooks.

I also found myself trying to learn Open Layers and React hooks too close together which ended up adding unnecessary complexity.

### Entry 5

After some difficulty making readable Open Layers code (alongside React code) I have decided to experiment with Leaflet to see how that compares. My initial impressions are much more positive: I understand the code and concepts more rapidly than I did with Open Layer, however, I need to consider that I now know more of the domain specific knowledge than before so this feeling is biased.

### Entry 6

I learned that a [chloropleth](https://en.wikipedia.org/wiki/Choropleth_map) map is what I'm after. I have updated my terminology to reflect this discovery.

### Entry 7

I have a (slow) dummy version working with a single fixed colour for the countries.

### Entry 8

React has a Leaflet library called [react-leaflet](https://react-leaflet.js.org/) because I hope it will tidy up the code a bit through components.

Initial impressions are that it helps to reduce much of where the complexity is through React components. I am investigating ways to create re-usable functions which encapsulate what I currently have in the `useEffect` blocks e.g., geojson parsing. I hope this will allow smoother change detection.

### Entry 9

react-leaflet didn't help to clean up the code when using function components and hooks, instead I felt it became less readable. I am exploring all avenues and experimenting with with class components, instead of hooks, maybe that will clean things up. react-leaflet comes with its own issues such as geojson layers not updating when the data is updated. Apparently the solution to this is to provide a key function which will change but I have not yet confirmed this.

### Entry 10

I ended up sticking to my guns because I now understand how my code works more than the others. While the leaflet code is ugly because it's manipulating the DOM from within a component and not using React components, it actually isn't complex after. Checking for an update in react class components also requires more reading and lifecycle stages are notorious in their own right.

While experimenting with react-leaflet I also went looking for chloropleth plugins/libraries out of curiosity and I discovered [leaflet-chloropleth](https://github.com/timwis/leaflet-choropleth). This seemed promising but didn't seem to play nice with my hover and select handlers, because it preferred displaying the data statically whereas hover and selection are key to this use case.

### Entry 11

After doing some reading and refactoring I've decided to change how I get the country data. Up until now I've been doing a lookup when a country is selected. I plan to apply the data to each feature directly when the geojson is being parsed. This will increase the upfront load time slightly but will improve user experience regarding the interaction, something which I value more than an initial load.

### Entry 12

Fully embracing hooks tends to make the code cleaner than an in-between state. The cleanest way to mix hooks and code which interacts directly with the DOM, as map libraries, do remains to be seen but for now I'll use hooks as much as I can.

### Entry 13

It turns when you create components as functions the entire function is equivalent to a class-based approach's `render()` method. This means `useEffect` and everything in the function run each time the function is rendered. I added some checks so certain code, like fetching and parsing the geojson, would only run once. This indeed appears to helped with change detection.

### Entry 14

It turns out PDF parsing is difficult because many of the renderers don't even render tables as columns. This means parsing a PDF is not a matter of parsing text, instead methods which use OCR and/or look at specific pixels are required. In order to save time I will be forgoing this method for now - the coordinates are not the same across date, with the WHO's data table getting larger each time a new country is added. This in turn changes the coordinates for each day. Instead I will be using the data that a team from the [Humanistic GIS Laboratory at the University of Washington](https://hgis.uw.edu/) has already [made available](https://github.com/jakobzhao/virus). Their data, however, provides varying levels of granularity across the world, meaning the USA, Canada, and China are split up into states/provinces and territories/prefectures which does not fit my model of displaying data at a country level. This will require me to write logic grouping subdivisions into their respective countries and tallying up the numbers for each.

This spun off a mini-project in my head which serves the ISO-3166 country codes as a standalone API. It provides an opportunity to learn more about AWS, which still holds a significant market share even when in decline. A story for a later date.

### Entry 15

I find myself straying more and more off course. I have climbed out of the rabbit hole and set up groupings of the country subdivision data into countries. This means I can have something working to serve publicly. In the process of testing everything with live data I was reminded I hadn't accounted for CORS yet. Because I am using data offered by the University of Washington's I do not have access to the server. Because of this I cannot set up the headers required to mitigate CORS in the preferred way. The next option is to use a proxy which normally requires a server and will add further feature creep I'm unwilling to allow. I began to wonder if this was all for naught without live data, until I discovered [CORS Anywhere](https://cors-anywhere.herokuapp.com/). CORS Anywhere is a Heroku App which serves the exact purpose I need with no setup required. Because I'm not expecting large volumes of traffic I'm not too concerned about the reliability of such a free service.

### Entry 16

When searching for colour palettes I stumbled upon on titled [Forest Morning](https://www.colourhunt.com/palette/cjf74j2eqdg3w0119my22vt6f/) whose muted yet also vibrant colours stood out to me. The traffic light scheme also allowed me to designate green as countries with 0 confirmed cases.

### Entry 17

As I've progressed things further I've decided/assumed that a) the colours are more interesting than the country names because they represent the data b) most people want to see their own country's data first, and they know where in the world their own country is c) if a user cares about a particular country that isn't their country of residence, they will know where in the world that country is. These decisions and assumptions allow me to remove the [Open Street Map](https://www.openstreetmap.org) [tile layer](https://leafletjs.com/reference-1.6.0.html#tilelayer) and reduce the clutter.

As I've worked with the aforemntioned colour palette I've discovered that it lends itself nicely to a dark mode scheme - after removing the Open Street Map tile layer I found a dark mode themed blue provided an acceptable contrast with my colour palette. I've opted to embrace this theme and styled the rest of the UI elements accordingly.

### Entry 18

It turns out there is a chroma.js library which will create colour scales perfect for this use case. I am considering using it to create more meaninful bands than the 3 colours I have on offer. This would also be a good time to create a legend.

### Entry 19

When I begun this project I only found two or three COVID-19 distribution maps and the local news outlets within my networks had not yet begun displaying the outbreak data on their own maps. At the time of writing these maps are now front and centre given the scale of the pandemic. This is a testament to the power of getting to market fast, and effective marketing reach.
