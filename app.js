// Requires
var http = require('http');
var router = require('./router');

http.createServer((request, response) => {
    router.route(request, response);
}).listen(8080);