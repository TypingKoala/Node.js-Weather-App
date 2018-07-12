// Problem: Create a command line API which accepts a zip code as a parameter. Output the current weather.

// Requires
const https = require('https');
const http = require('http');
const EventEmitter = require('events');

// Api Keys
const api = require('./api.json');

// Endpoints
// Google Maps: https://maps.googleapis.com/maps/api/geocode/json?address=[address]&key=[key]
// Dark Sky: https://api.darksky.net/forecast/[key]/[latitude],[longitude]
const googleMapsEndpoint = 'https://maps.googleapis.com/maps/api/geocode/json';
const googleMapsAddressParam = '?address=';
const googleMapsApiParam = '&key=';
const darkSkyEndpoint = 'https://api.darksky.net/forecast/';
const splashbaseEndpoint = 'http://www.splashbase.co/api/v1/images/random';

// Inputs
function getLocationAndWeather(input) {
    if (input.length > 0) {
        getCoords(input).then((result) => getWeather(result.lat, result.long, result.loc)).then(result => printWeather(result.location, result.conditions, result.temSperature) )
    } else {
        console.log('Please run with additional argument of location.')
    }
}

const input = process.argv.splice(2);

// Run App
getLocationAndWeather(input);

// Functions
function printWeather(loc, conditions, temperature) {
    let message = `In ${loc}, it is currently ${conditions} with a temperature of ${Math.round(temperature)} degrees.`;
    console.log(message);
}

function printError(error) {
    console.log(error.message);
}


function getCoords(input) {
    return new Promise((resolve, reject) => {
        try {
            https.get(googleMapsEndpoint + googleMapsAddressParam + input + googleMapsApiParam + api.googleMapsApiKey, (response) => {
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
                            resolve({"lat": lat, "long": long, "loc": loc});
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
            reject(googleMapsError);
        }
    
        function googleMapsApiError(googleMapsResponse) {
            const message = "Google Maps returned error code: " + googleMapsResponse.status;
            const error = new Error(message);
            reject(error);
        }
    
        function googleMapsRequestError(response) {
            message = `Google Maps request failed with error ${response.statusCode} ${http.STATUS_CODES[response.statusCode]}`;
            let statusCodeError = new Error(message);
            reject(statusCodeError);
        }
    })
}
// Receive Weather Info

function getWeather(latitude, longitude, loc) {
    return new Promise((resolve, reject) => {
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
                        const hourlysummary = response.hourly.summary;
                        resolve({
                            "conditions": conditions, 
                            "temperature": temperature, 
                            "location": loc,
                            "hourlysummary": hourlysummary});

                    });
                } else {
                    let statusCodeError = new Error('Dark Sky request failed with error: ' + response.statusCode + " " + http.STATUS_CODES[response.statusCode]);
                    reject(statusCodeError);
                }
            });
        } catch (error) {
            const darkSkyError = new Error('http.get Critical Error Thrown for Dark Sky');
            reject(darkSkyError);
        }
    })
}

function getImage(input) {
    return new Promise((resolve, reject) => {
        try {
            https.get(splashbaseEndpoint, (response) => {
                // Check if 200 response
                if (response.statusCode === 200) {
                    body = "";
                    response.on('data', data => {
                        body += data.toString();
                    });
                    response.on('end', () => {
                        const splashbaseResponse = JSON.parse(body);
                            const imageUrl = splashbaseResponse.url;
                            resolve(imageUrl);
                    });
                } else {
                    splashbaseRequestError(response);
                }
            });
        } catch (error) {
            const splashbaseError = new Error('http.get Critical Error Thrown for Splashbase. ' + error.message);
            reject(splashbaseError);
        }

    
        function splashbaseRequestError(response) {
            message = `Splashbase request failed with error ${response.statusCode} ${http.STATUS_CODES[response.statusCode]}`;
            let statusCodeError = new Error(message);
            reject(statusCodeError);
        }
    })
}

module.exports.getWeather = getWeather;
module.exports.getCoords = getCoords;
module.exports.getImage = getImage;