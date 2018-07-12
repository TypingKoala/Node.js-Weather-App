// Requires
var http = require('http');
var router = require('./router');
const port = 8080;

http.createServer((request, response) => {
    router.route(request, response);
}).listen(port);
console.log('Server listening on port ' + port);