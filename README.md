# Pretty Weather

This is a simple web application that accepts a location input and returns the temperature, current weather conditions, and a future hourly weather summary. The application uses the following APIs:

 - [Google Geocoding API](https://darksky.net/dev) to generate coordinates (latitude and longitude) based on the user input (API key needed)
 - [Dark Sky API](https://developers.google.com/maps/documentation/geocoding/start) to determine the weather at that position (API key needed)
 - [Splashbase API](http://www.splashbase.co/api) to show the user a random background photo with each reload (no API Key needed)

## Install

In a new folder, run:

> git clone git@github.com:TypingKoala/Node.js-Weather-App.git

Then, install Node modules using npm:

> npm install

In the folder, create a JSON file including your Google Geocoding API Key and Dark Sky API Key:

> nano api.json

Fill in your keys:
>     {
>     "darkSkyApiKey": "<YOUR_KEY_HERE>",
>     "googleMapsApiKey": "<YOUR_KEY_HERE>"
>     }

Run the web app with the desired port number as an argument:
> node app.js 3000

## Functionality
When loading the homepage, Express looks for a `Location` cookie that saves the location that the user last requested. If found, the user is redirected to that page. If not found, it defaults to `Los Angeles`. When user searches for a new location, the browser will save it as a cookie.

## Packages/Programs Used
This is an Express web application (on Node.js) which implements native Node.js functionality for API calls. The templating language is Pug (formerly Jade). 

## Credits
The website design is by [HTML5UP](https://html5up.net/eventually), licensed under the [Creative Commons Attribution 3.0 License](https://html5up.net/license).
