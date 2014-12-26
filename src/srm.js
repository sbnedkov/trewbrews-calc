var trewbrews = angular.module('trewbrews');

trewbrews.service('srm', ['utils', function (utils) {
    var srm = {
    };

    srm.calculateSrm = function (fermentables, fermentableSizes, batchSize) {
        var mcu = _.reduce(fermentables, function (acc, f, key) {
            acc += f ? (f.color * 8.34538 * fermentableSizes[key]) / batchSize : 0;
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
        /*
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
        */
    };

    return srm;
}]);
