var trewbrews = angular.module('trewbrews');

trewbrews.service('ibu', ['utils', function (utils) {
    var _ = window._;
    var ibu = {
    };

    ibu.calculateIbu = function (hops, sizes, fermentables, fsizes, boilSize, batchSize, boilTime, og) {
        var ibus = 0;
        fermentables = _.filter(fermentables, function (fermentable) {
            return fermentable;
        });
        hops = _.filter(hops, function (hop) {
            return hop.alpha;
        });

        _.each(hops, function (hop, idx) {
            ibus += ibuFromHop(hop, sizes[idx], batchSize, boilTime, og);
        });

        return ibus;
    };

    function ibuFromHop (hop, size, batchSize, boilTime, og) {
        var AArating = getAlpha(hop.alpha) / 100;
        var grams = size * 1000;
        var ibus = getIbus(AArating, size, batchSize, og);

        return ibus;
    }

    function getIbus (AArating, size, finalVolume, og) {
        return ((AArating * size * 1000) / finalVolume) * (1.65 * Math.pow(0.000125, (og - 1)));
    }

    function getAlpha (alphaRange) {
        var m = alphaRange.match(/^([0-9\.]*)% - ([0-9]*)%$/);

        return (parseFloat(m[0]) + parseFloat(m[1])) / 2;
    }

    return ibu;
}]);
