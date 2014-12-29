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

    // Watch for color change
    $scope.$watchGroup(['fermentable1', 'fermentable2', 'fermentable3', 'fsize1', 'fsize2', 'fsize3', 'boilsize', 'size'], function (vals) {
        var f1, f2, f3, fsize1, fsize2, fsize3, boilSize, batchSize;

        f1 = vals[0] && JSON.parse(vals[0]);
        f2 = vals[1] && JSON.parse(vals[1]);
        f3 = vals[2] && JSON.parse(vals[2]);

        fsize1 = $scope.fsize1 && JSON.parse($scope.fsize1);
        fsize2 = $scope.fsize2 && JSON.parse($scope.fsize2);
        fsize3 = $scope.fsize3 && JSON.parse($scope.fsize3);

        boilSize = $scope.boilsize && JSON.parse($scope.boilsize);
        batchSize = $scope.size && JSON.parse($scope.size);

        $scope.srm = srm.calculateSrm([f1, f2, f3], [fsize1, fsize2, fsize3], boilSize, batchSize);
    });

    // Watch for gravity change
    $scope.$watchGroup(['fermentable1', 'fermentable2', 'fermentable3', 'fsize1', 'fsize2', 'fsize3', 'yeast', 'boilsize', 'size', 'efficiency'], function (vals) {
        var f1, f2, f3, fsize1, fsize2, fsize3, yeast, boilSize, batchSize, efficiency;
        var grav;

        f1 = vals[0] && JSON.parse(vals[0]);
        f2 = vals[1] && JSON.parse(vals[1]);
        f3 = vals[2] && JSON.parse(vals[2]);

        fsize1 = $scope.fsize1 && JSON.parse($scope.fsize1);
        fsize2 = $scope.fsize2 && JSON.parse($scope.fsize2);
        fsize3 = $scope.fsize3 && JSON.parse($scope.fsize3);

        yeast = $scope.yeast && JSON.parse($scope.yeast);

        boilSize = $scope.boilsize && JSON.parse($scope.boilsize);
        batchSize = $scope.size && JSON.parse($scope.size);
        efficiency = $scope.efficiency && JSON.parse($scope.efficiency);

        grav = gravity.calculateGravity([f1, f2, f3], [fsize1, fsize2, fsize3], yeast, boilSize, batchSize, efficiency);

        $scope.og = utils.round(grav.og);
        $scope.fg = utils.round(grav.fg);
        $scope.abv = utils.round(gravity.calculateAbv(grav));
    });

    // Watch for IBU change
    $scope.$watchGroup(['fermentable1', 'fermentable2', 'fermentable3', 'fsize1', 'fsize2', 'fsize3', 'hops', 'hsize', 'boilsize', 'size', 'time'], function (vals) {
        var f1, f2, f3, fsize1, fsize2, fsize3, hops, hsize, boilSize, batchSize, time;

        f1 = vals[0] && JSON.parse(vals[0]);
        f2 = vals[1] && JSON.parse(vals[1]);
        f3 = vals[2] && JSON.parse(vals[2]);

        fsize1 = $scope.fsize1 && JSON.parse($scope.fsize1);
        fsize2 = $scope.fsize2 && JSON.parse($scope.fsize2);
        fsize3 = $scope.fsize3 && JSON.parse($scope.fsize3);

        hops = $scope.hops && JSON.parse($scope.hops);
        hsize = $scope.hsize && JSON.parse($scope.hsize);

        boilSize = $scope.boilsize && JSON.parse($scope.boilsize);
        batchSize = $scope.size && JSON.parse($scope.size);
        time = $scope.time && JSON.parse($scope.time);

        $scope.ibu = utils.round(ibu.calculateIbu(hops, hsize, [f1, f2, f3], [fsize1, fsize2, fsize3], boilSize, batchSize, time, $scope.og));
    });

    $scope.srmColor = function () {
        return srm.color($scope.srm);
    };
}]);
