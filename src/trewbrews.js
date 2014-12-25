var trewbrews = angular.module('trewbrews', []);

trewbrews.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

trewbrews.controller('calculator', function ($scope) {
    $scope.$watchGroup(['fermentable1', 'fermentable2', 'fsize1', 'fsize2', 'size'], function (vals) {
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
        $scope.srm = round(1.4922 * (Math.pow(mcu, 0.6859)));
    });

    $scope.srmColor = function () {
        return color($scope.srm);
    };
});

function kgsToLbs (kgs) {
    return kgs * 2.2046;
}

function litersToGallons (liters) {
    return liters * 0.264172052;
}

function round (n) {
    return Math.round(1000 * n) / 1000;
}

function color (srm) {
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
}
