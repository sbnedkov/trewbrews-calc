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

    utils.round = function (n) {
        return Math.round(1000 * n) / 1000;
    };

    return utils;
}]);
