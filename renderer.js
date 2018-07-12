const fs = require('fs');
var weather = require('./weather');
const url = require('url');
const path = require('path');

function mergeValues(content, values) {
    for (var key in values) {
        content = content.replace(`{{{${key}}}}`, values[key]);
    };
    return content
}

function assetsGet(request, response) {
    console.log(request.url)
    var contents = fs.readFileSync('./static' + request.url);
    response.write(contents);
    response.end();
}

function renderWeather(request, response) {
    console.log(request.url)
    var contents = fs.readFileSync('./static/index.html', {
        encoding: 'utf8'
    });
    if (request.url.slice(1)) {
        input = request.url.slice(1);
    } else {
        input = "Los Angeles"
    }
    weather.getCoords(input)
        .then(gmaps => weather.getWeather(gmaps.lat, gmaps.long, gmaps.loc))
        .then(weather => {
            var values = {};
            values.title = weather.location;
            values.line1 = `It is currently ${Math.round(weather.temperature)} degrees and ${weather.conditions.toLowerCase()}.`;
            values.line2 = weather.location;
            values.line3 = weather.hourlysummary;
            var body = mergeValues(contents, values)
            response.write(body);
            response.end();
        })

}

function webServer(req, res) {
    console.log(`${req.method} ${req.url}`);
    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    let pathname = `./static${parsedUrl.pathname}`;
    // maps file extention to MIME types
    const mimeType = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.eot': 'appliaction/vnd.ms-fontobject',
        '.ttf': 'aplication/font-sfnt'
    };
    fs.exists(pathname, function (exist) {
        if (!exist) {
            // if the file is not found, return 404
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }
        // if is a directory, then look for index.html
        if (fs.statSync(pathname).isDirectory()) {
            pathname += '/index.html';
        }
        // read file from file system
        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                // based on the URL path, extract the file extention. e.g. .js, .doc, ...
                const ext = path.parse(pathname).ext;
                // if the file is found, set Content-type and send data
                res.setHeader('Content-type', mimeType[ext] || 'text/plain');
                res.end(data);
            }
        });
    });
}

module.exports.renderWeather = renderWeather;
module.exports.assetsGet = assetsGet;
module.exports.webServer = webServer;