var trewbrews = angular.module('trewbrews');

trewbrews.service('ibu', ['utils', function (utils) {
    var _ = window._;
    var ibu = {
    };

    ibu.calculateIbu = function (hops, sizes, fermentables, fsizes, boilSize, batchSize, boilTime, og) {
        hops = _.filter(hops, function (hop) {
            return hop.alpha;
        });
        // TODO: for malt extracts we have bitterness in the fermentables

        return _.reduce(hops, function (acc, hop, idx) {
            return acc + ibuFromHop(hop, sizes[idx], batchSize, boilTime, og) / hops.length;
        }, 0);
    };

    function ibuFromHop (hop, size, batchSize, boilTime, og) {
        // TODO: use per hop boil time
        return 1.65 * Math.pow(0.000125, og - 1) * ((1 - Math.pow(Math.E, -0.04 * boilTime)) / 4.15) *
            (((getAlpha(hop.alpha) / 100) * utils.gramsToOz(size) * 7490) / utils.litersToGallons(batchSize));
    }

    function getAlpha (alphaRange) {
        var m = alphaRange.match(/^([0-9\.]*)% - ([0-9\.]*)%$/);

        return (parseFloat(m[1]) + parseFloat(m[2])) / 2;
    }

    return ibu;
}]);
