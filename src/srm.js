var trewbrews = angular.module('trewbrews');

trewbrews.service('srm', ['utils', function (utils) {
    var srm = {
    };

    srm.calculateSrm = function (fermentables, fermentableSizes, batchSize) {
        var mcu = _.reduce(fermentables, function (acc, f, key) {
            acc += f ? (f.color * utils.kgsToLbs(fermentableSizes[key])) / utils.litersToGallons(batchSize) : 0;
            return acc;
        }, 0) / _.filter(fermentables, function (f) { return f; }).length;

        return utils.round(1.4922 * (Math.pow(mcu, 0.6859)));
    };

    srm.color =  function (srm) {
        if (srm <= 2) {
            return '#F8F753';
        } else if (srm <= 3) {
            return '#F6F513';
        } else if (srm <= 4) {
            return '#ECE61A';
        } else if (srm <= 6) {
            return '#D5BC26';
        } else if (srm <= 8) {
            return '#BF923B';
        } else if (srm <= 10) {
            return '#BF813A';
        } else if (srm <= 13) {
            return '#BC6733';
        } else if (srm <= 17) {
            return '#8D4C32';
        } else if (srm <= 20) {
            return '#5D341A';
        } else if (srm <= 24) {
            return '#261716';
        } else if (srm <= 29) {
            return '#0F0B0A';
        } else if (srm <= 35) {
            return '#080707';
        } else if (srm) {
            return '#030403';
        }
    };

    return srm;
}]);
