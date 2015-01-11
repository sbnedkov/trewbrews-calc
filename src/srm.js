var trewbrews = angular.module('trewbrews');

trewbrews.service('srm', ['utils', function (utils) {
    var _ = window._;
    var srm = {
    };

    srm.calculateSrm = function (fermentables, fermentableSizes, boilSize, batchSize) {
        var batchSizeGallons = utils.litersToGallons(batchSize);
        var mcu = _.reduce(fermentables, function (acc, f, key) {
            acc += (f.srm * utils.kgsToLbs(fermentableSizes[key])) / batchSizeGallons;
            return acc;
        }, 0);

        return utils.round(1.4922 * (Math.pow(mcu, 0.6859)));
    };

    srm.color =  function (srm) {
        var r = 0.5 + (272.098 - 5.80255*srm);
        if (r > 253.0) {
            r = 253.0;
        }
        var g = (srm > 35)? 0 : 0.5 + (2.41975e2 - 1.3314e1*srm + 1.881895e-1*srm*srm);
        var b = 0.5 + (179.3 - 28.7*srm);

        r = (r < 0) ? 0 : ((r > 255)? 255 : r);
        g = (g < 0) ? 0 : ((g > 255)? 255 : g);
        b = (b < 0) ? 0 : ((b > 255)? 255 : b);

        return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
    };

    return srm;
}]);
