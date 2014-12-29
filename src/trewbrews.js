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

    $scope.addFermentable = function () {
        $scope.fermentablesarr.push({});
    };

    $scope.deleteFermentable = function (idx) {
        $scope.fermentablesarr.splice(idx, 1);
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
    $scope.$watch('[fermentablesarr, hops, hsize, boilsize, size, time]', function (vals) {
        var hops, hsize, boilSize, batchSize, time;


        hops = $scope.hops && JSON.parse($scope.hops);
        hsize = $scope.hsize && JSON.parse($scope.hsize);

        boilSize = $scope.boilsize && JSON.parse($scope.boilsize);
        batchSize = $scope.size && JSON.parse($scope.size);
        time = $scope.time && JSON.parse($scope.time);

        $scope.ibu = utils.round(ibu.calculateIbu(hops, hsize, getFermentables(), getSizes(), boilSize, batchSize, time, $scope.og));
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
}]);
