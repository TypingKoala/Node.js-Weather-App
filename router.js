const renderer = require('./renderer');
const headers = {'Content-type': 'text/html'};
const querystring = require('querystring');

function route(request, response) {
    // If in static assets
    if (request.method.toUpperCase() === 'GET' && request.url.slice(0,8) === "/assets/" || request.url === "/favicon.ico") {
        renderer.webServer(request, response);
    }
    // If search POST request
    else if (request.method.toUpperCase() === 'POST') {
        request.on('data', function(postBody) {
            var query = querystring.parse(postBody.toString());
            response.writeHead(303, {'Location': query.search});
            response.end();
        });
    } 
    // If any other GET request, render weather page
    else if (request.method.toUpperCase() === 'GET') {
        response.writeHead(200, headers);
        renderer.renderWeather(request, response);
    } else {
        console.log('Router Error. Unable to determine route.')
    }
}

module.exports.route = route;