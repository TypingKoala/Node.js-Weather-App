// Problem: Create a command line API which accepts a zip code as a parameter. Output the current weather.

// Requires
const https = require('https');
const http = require('http');

// Api Keys
const api = require('./api.json');

// Endpoints
// Google Maps: https://maps.googleapis.com/maps/api/geocode/json?address=[address]&key=[key]
// Dark Sky: https://api.darksky.net/forecast/[key]/[latitude],[longitude]

const googleMapsEndpoint = 'https://maps.googleapis.com/maps/api/geocode/json';
const googleMapsAddressParam = '?address=';
const googleMapsApiParam = '&key=';

const darkSkyEndpoint = 'https://api.darksky.net/forecast/';

// Inputs
function getLocation() {
    if (call.length > 0) {
        call.forEach(location => getCoords(location));
    } else {
        console.log('Please run with additional argument(s) of location(s).')
    }
}

const call = process.argv.splice(2)

// Run App
getLocation();


// Functions
function printWeather(loc, conditions, temperature) {
    let message = `In ${loc}, it is currently ${conditions} with a temperature of ${Math.round(temperature)} degrees.`;
    console.log(message);
}

function printError(error) {
    console.log(error.message);
}


function getCoords(address) {
    try {
        https.get(googleMapsEndpoint + googleMapsAddressParam + address + googleMapsApiParam + api.googleMapsApiKey, (response) => {
            // Check if 200 response
            if (response.statusCode === 200) {
                body = "";
                response.on('data', data => {
                    body += data.toString();
                });
                response.on('end', () => {
                    const googleMapsResponse = JSON.parse(body);
                    if (googleMapsResponse.status == "OK") {
                        const lat = googleMapsResponse.results[0].geometry.location.lat;
                        const long = googleMapsResponse.results[0].geometry.location.lng;
                        const loc = googleMapsResponse.results[0].formatted_address;
                        getWeather(lat, long, loc);
                    } else {
                        googleMapsApiError(googleMapsResponse);
                    }

                });
            } else {
                googleMapsRequestError(response);
            }
        });
    } catch (error) {
        const googleMapsError = new Error('http.get Critical Error Thrown for Google Maps. ' + error.message);
        printError(googleMapsError);
    }

    function googleMapsApiError(googleMapsResponse) {
        const message = "Google Maps returned error code: " + googleMapsResponse.status;
        const error = new Error(message);
        printError(error);
    }

    function googleMapsRequestError(response) {
        message = `Google Maps request failed with error ${response.statusCode} ${http.STATUS_CODES[response.statusCode]}`;
        let statusCodeError = new Error(message);
        printError(statusCodeError);
    }
}
// Receive Weather Info

function getWeather(latitude, longitude, loc) {
    try {
        https.get(darkSkyEndpoint + api.darkSkyApiKey + '/' + latitude + ',' + longitude, (response) => {
            // Check if 200 response
            if (response.statusCode === 200) {
                body = "";
                response.on('data', data => {
                    body += data.toString();
                });
                response.on('end', () => {
                    const response = JSON.parse(body);
                    const conditions = response.currently.summary;
                    const temperature = response.currently.temperature;
                    printWeather(loc, conditions, temperature);
                });
            } else {
                let statusCodeError = new Error(http.STATUS_CODES[response.statusCode]);
                printError(statusCodeError);
            }
        });
    } catch (error) {
        const darkSkyError = new Error('http.get Critical Error Thrown for Dark Sky');
        printError(darkSkyError);
    }
}