var _ = require('lodash');
var express = require('express');
var hbs = require('hbs');

var fermentables = require('./data/fermentable.json');
var hops = require('./data/hop.json');
var yeasts = require('./data/yeast.json');

var app = express();

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use("/src", express.static(__dirname + "/src"));

app.get('/', function (req, res) {
    res.render('main.hbs', {
        fermentables: _.map(fermentables, function (fermentable) {
            return {
                name: fermentable.name,
                data: JSON.stringify(fermentable)
            };
        }),
        hops: _.map(hops, function (hop) {
            return {
                name: hop.name,
                data: JSON.stringify(hop)
            };
        }),
        yeasts: _.map(yeasts, function (yeast) {
            return {
                name: yeast.name,
                data: JSON.stringify(yeast)
            };
        })
    });
});

app.listen(31310);

console.log('Server started');
