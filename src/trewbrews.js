var trewbrews = angular.module('trewbrews', []);

trewbrews.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

trewbrews.controller('calculator', function ($scope) {
    $scope.$watchGroup(['fermentable1', 'fermentable2', 'fsize1', 'fsize2', 'size'], function (vals) {
        var f1, f2, mcu, mcu1, mcu2, fsize1, fsize2, batchSize;

        f1 = vals[0] && JSON.parse(vals[0]);
        f2 = vals[1] && JSON.parse(vals[1]);

        fsize1 = $scope.fsize1 && JSON.parse($scope.fsize1);
        fsize2 = $scope.fsize2 && JSON.parse($scope.fsize2);
        batchSize = JSON.parse($scope.size);

        mcu1 = f1 && (f1.color * kgsToLbs(fsize1)) / litersToGallons(batchSize);
        mcu2 = f2 && (f2.color * kgsToLbs(fsize2)) / litersToGallons(batchSize);

        if (mcu1 && mcu2) {
            mcu = (mcu1 + mcu2) / 2;
        } else if (mcu1) {
            mcu = mcu1;
        } else if (mcu2) {
            mcu = mcu2;
        }
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
