var trewbrews = angular.module('trewbrews', []);

trewbrews.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

trewbrews.controller('calculator', ['$scope', 'srm', 'gravity', 'ibu', 'utils', function ($scope, srm, gravity, ibu, utils) {
    $scope.size = 20;
    $scope.time = 60;
    $scope.efficiency = 75;

    // Watch for color change
    $scope.$watchGroup(['fermentable1', 'fermentable2', 'fsize1', 'fsize2', 'size'], function (vals) {
        var f1, f2, fsize1, fsize2, batchSize;

        f1 = vals[0] && JSON.parse(vals[0]);
        f2 = vals[1] && JSON.parse(vals[1]);

        fsize1 = $scope.fsize1 && JSON.parse($scope.fsize1);
        fsize2 = $scope.fsize2 && JSON.parse($scope.fsize2);

        batchSize = $scope.size && JSON.parse($scope.size);

        $scope.srm = srm.calculateSrm([f1, f2], [fsize1, fsize2], batchSize);
    });

    // Watch for gravity change
    $scope.$watchGroup(['fermentable1', 'fermentable2', 'fsize1', 'fsize2', 'yeast', 'size', 'efficiency'], function (vals) {
        var f1, f2, fsize1, fsize2, yeast, batchSize, efficiency;
        var grav;

        f1 = vals[0] && JSON.parse(vals[0]);
        f2 = vals[1] && JSON.parse(vals[1]);

        fsize1 = $scope.fsize1 && JSON.parse($scope.fsize1);
        fsize2 = $scope.fsize2 && JSON.parse($scope.fsize2);

        yeast = $scope.yeast && JSON.parse($scope.yeast);

        batchSize = $scope.size && JSON.parse($scope.size);
        efficiency = $scope.efficiency && JSON.parse($scope.efficiency);

        grav = gravity.calculateGravity([f1, f2], [fsize1, fsize2], yeast, batchSize, efficiency);

        $scope.og = utils.round(grav.og);
        $scope.fg = utils.round(grav.fg);
        $scope.abv = utils.round(gravity.calculateAbv(grav));
    });

    // Watch for IBU change
    $scope.$watchGroup(['fermentable1', 'fermentable2', 'fsize1', 'fsize2', 'hops', 'hsize', 'size', 'time'], function (vals) {
        var f1, f2, fsize1, fsize2, hops, hsize, batchSize, time;

        f1 = vals[0] && JSON.parse(vals[0]);
        f2 = vals[1] && JSON.parse(vals[1]);

        fsize1 = $scope.fsize1 && JSON.parse($scope.fsize1);
        fsize2 = $scope.fsize2 && JSON.parse($scope.fsize2);

        hops = $scope.hops && JSON.parse($scope.hops);
        hsize = $scope.hsize && JSON.parse($scope.hsize);

        batchSize = $scope.size && JSON.parse($scope.size);
        time = $scope.time && JSON.parse($scope.time);

        $scope.ibu = ibu.calculateIbu(hops, hsize, [f1, f2], [fsize1, fsize2], batchSize, time, $scope.og);
    });

    $scope.srmColor = function () {
        return srm.color($scope.srm);
    };
}]);
