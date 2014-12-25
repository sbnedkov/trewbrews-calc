var trewbrews = angular.module('trewbrews', []);

trewbrews.controller('calculator', function ($scope) {
    $scope.$watchGroup(['fermentable1', 'fermentable2', 'fsize1', 'fsize2'], function (vals) {
        var f1, f2, mcu, fsize1, fsize2, batchSize;

        if (vals[0]) {
            f1 = JSON.parse(vals[0]);
        }

        if (vals[1]) {
            f2 = JSON.parse(vals[1]);
        }

        fsize1 = JSON.parse($scope.fsize1);
        fsize2 = $scope.fsize2;
        batchSize = JSON.parse($scope.size);

        mcu = (f1.color * kgsToLbs(fsize1)) / litersToGallons(batchSize);
        $scope.srm = 1.4922 * (Math.pow(mcu, 0.6859));
    });
});

function kgsToLbs (kgs) {
    return kgs * 2.2046;
}

function litersToGallons (liters) {
    return liters * 0.264172052;
}
