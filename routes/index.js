const express = require('express');
const router = express.Router();
const background = require('../background');
const weather = require('../weather');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser());

router.get('/', (req, res) => {
    if (req.cookies.location) {
        res.redirect(req.cookies.location);
    } else {
        res.redirect('/Los Angeles')
    }
    
})

router.get('/:input', (req, res) => {
    background.getBackground().then(function(parsedData) {
        return parsedData.url
    }).then(function(url) {
        weather.getCoords(req.params.input)
        .then(gmaps => weather.getWeather(gmaps.lat, gmaps.long, gmaps.loc))
        .then(weather => {
            templateVars = {
                temperature: Math.round(weather.temperature),
                conditions: weather.conditions.toLowerCase(),
                location: weather.location,
                summary: weather.hourlysummary,
                backgroundUrl: url
            };
            res.cookie('location', req.params.input);
            res.render('index', templateVars);
        })
    }).catch(error => {
        console.log(error.message);
        res.render('error')
    });
    
});

router.post('/', (req, res) => {
    res.redirect('/' + req.body.search);
});

module.exports = router;