var trewbrews = angular.module('trewbrews', []);

trewbrews.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

trewbrews.controller('calculator', ['$scope', 'srm', function ($scope, srm) {
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

    $scope.srmColor = function () {
        return srm.color($scope.srm);
    };
}]);
