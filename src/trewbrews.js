var trewbrews = angular.module('trewbrews', []);

trewbrews.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

trewbrews.controller('calculator', ['$scope', 'srm', 'gravity', 'ibu', 'utils', function ($scope, srm, gravity, ibu, utils) {
    $scope.boilsize = 28.5;
    $scope.size = 21;
    $scope.time = 60;
    $scope.efficiency = 75;
    $scope.fermentablesarr = [];
    $scope.hopsarr = [];

    $scope.addFermentable = function () {
        $scope.fermentablesarr.push({});
    };

    $scope.addHop = function () {
        $scope.hopsarr.push({});
    };

    $scope.deleteFermentable = function (idx) {
        $scope.fermentablesarr.splice(idx, 1);
    };

    $scope.deleteHop = function (idx) {
        $scope.hopsarr.splice(idx, 1);
    };

    // Watch for color change
    $scope.$watch('[fermentablesarr, boilsize, size]', function (vals) {
        var boilSize, batchSize;

        boilSize = parseInt($scope.boilsize);
        batchSize = parseInt($scope.size);

        $scope.srm = srm.calculateSrm(getFermentables(), getSizes(), boilSize, batchSize);
    }, true);

    $scope.srmColor = function () {
        return srm.color($scope.srm);
    };

    // Watch for gravity change
    $scope.$watch('[fermentablesarr, yeast, boilsize, size, efficiency]', function (vals) {
        var yeast, boilSize, batchSize, efficiency;
        var grav;


        yeast = $scope.yeast && JSON.parse($scope.yeast);

        boilSize = $scope.boilsize && JSON.parse($scope.boilsize);
        batchSize = $scope.size && JSON.parse($scope.size);
        efficiency = $scope.efficiency && JSON.parse($scope.efficiency);

        grav = gravity.calculateGravity(getFermentables(), getSizes(), yeast, boilSize, batchSize, efficiency);

        $scope.og = utils.round(grav.og);
        $scope.fg = utils.round(grav.fg);
        $scope.abv = utils.round(gravity.calculateAbv(grav));
    }, true);

    // Watch for IBU change
    $scope.$watch('[fermentablesarr, hopsarr, boilsize, size, time]', function (vals) {
        var boilSize, batchSize, time;
        var tmp;

        boilSize = $scope.boilsize && JSON.parse($scope.boilsize);
        batchSize = $scope.size && JSON.parse($scope.size);
        time = $scope.time && JSON.parse($scope.time);

        tmp = ibu.calculateIbu(getHops(), getHopsSizes(), getFermentables(), getSizes(), boilSize, batchSize, time, $scope.og);
        $scope.ibu = utils.round(tmp);
    }, true);

    function getFermentables () {
        return _.map($scope.fermentablesarr, function (f) {
            return JSON.parse(f.fermentable || "{}");
        });
    }

    function getSizes () {
        return _.map($scope.fermentablesarr, function (f) {
            return parseInt(f.size);
        });
    }

    function getHops () {
        return _.map($scope.hopsarr, function (h) {
            return JSON.parse(h.hop || "{}");
        });
    }

    function getHopsSizes () {
        return _.map($scope.hopsarr, function (h) {
            return parseInt(h.size);
        });
    }
}]);
