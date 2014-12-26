var trewbrews = angular.module('trewbrews');

trewbrews.service('utils', ['polynomial', function (Polynomial) {
    var utils = {
    };

    utils.kgsToLbs = function (kgs) {
        return kgs * 2.2046;
    };

    utils.litersToGallons = function (liters) {
        return liters * 0.264172052;
    };

    utils.round = function (n) {
        return Math.round(1000 * n) / 1000;
    };

    utils.plato = function (sugarKg, volume) {
        var waterKg = volume  - sugarKg / 1.587;

        return sugarKg / (sugarKg + waterKg) * 100;
    };

    utils.platoToSg = function (plato) {
        var polynomial = new Polynomial([-616.868, 1111.14, -630.272, 135.997]);

        polynomial.coeffs[0] -= plato;

        return polynomial.root(1.000, 1.050);
    };

    return utils;
}]);
