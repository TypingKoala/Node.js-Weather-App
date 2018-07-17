// Requires
const express = require('express');
const pug = require('pug');
const routes = require('./routes')

// Define app
const app = express();

// Middleware
app.set('view engine', "pug");

// Routes
app.use(express.static('static'));
app.use(routes);


// Error handling


// Start app
if (process.argv[2]) {
    try {
        app.listen(process.argv[2], () => {
            console.log('Listening on port ' + process.argv[2]);
        })
    } catch {
        console.log('That port number is invalid.')
    }
} else {
    app.listen(3000, () => {
        console.log('Listening on port ' + 3000);
    })
}