var trewbrews = angular.module('trewbrews');

trewbrews.service('utils', [function () {
    var utils = {
    };

    utils.kgsToLbs = function (kgs) {
        return kgs * 2.2046;
    };

    utils.litersToGallons = function (liters) {
        return liters * 0.264172052;
    };

    utils.gramsToOz = function (grams) {
        return grams * 0.0352739619;
    };

    utils.round = function (n) {
        return Math.round(1000 * n) / 1000;
    };

    utils.plato = function (sugarKg, volume) {
        var waterKg = volume  - sugarKg / 1.587;

        return sugarKg / (sugarKg + waterKg) * 100;
    };

    return utils;
}]);
