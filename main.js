var _ = require('lodash');
var express = require('express');
var hbs = require('hbs');

var fermentables = require('./data/fermentables.json');
var hops = require('./data/hops.json');
var yeasts = require('./data/yeasts.json');
var styles = require('./data/styles.json');

var app = express();

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use('/src', express.static(__dirname + '/src'));

app.get('/', function (req, res) {
    res.render('main.hbs', {
        fermentables: _.map(fermentables, function (fermentable) {
            return {
                name: fermentable.name,
                data: JSON.stringify(fermentable)
            };
        }),
        hops: _.chain(hops).
            filter(function (hop) {
                return hop.alpha;
            }).
            map(function (hop) {
                return {
                    name: hop.name,
                    data: JSON.stringify(hop)
                };
            }).
            value(),
        yeasts: _.chain(yeasts).
            filter(function (yeast) {
                return yeast.attenuation;
            }).
            map(function (yeast) {
                return {
                    name: yeast.name,
                    data: JSON.stringify(yeast)
                };
            }).
            value(),
        styles: _.chain(styles).
            filter(function (style) {
                return _.all(style, function (value) {
                    return value !== 'Variable';
                });
            }).
            map(function (style) {
                return {
                    name: style.name,
                    data: JSON.stringify(style)
                };
            }).
            sortBy(function (style) {
                return style.name;
            }).
            value()
    });
});

app.listen(process.env.PORT || 31310);

console.log('Server started');
