var trewbrews = angular.module('trewbrews', []);

trewbrews.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

trewbrews.controller('calculator', ['$scope', 'srm', 'gravity', 'ibu', 'utils', function ($scope, srm, gravity, ibu, utils) {
    var _ = window._;
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
    $scope.$watch('[fermentablesarr, boilsize, size]', function () {
        var boilSize, batchSize;

        batchSize = parseInt($scope.size);
        // TODO: get input for boil size
//        boilSize = parseInt($scope.boilsize);
        boilSize = 1.36 * batchSize;

        $scope.srm = srm.calculateSrm(getFermentables(), getSizes(), boilSize, batchSize);
    }, true);

    $scope.srmColor = function () {
        return srm.color($scope.srm);
    };

    // Watch for gravity change
    $scope.$watch('[fermentablesarr, yeast, boilsize, size, efficiency, equipment]', function () {
        var yeast, boilSize, batchSize, efficiency, equipment;
        var grav;

        yeast = $scope.yeast && [JSON.parse($scope.yeast)] || [];

        batchSize = $scope.size && JSON.parse($scope.size);
        // TODO: get input for boil size
//        boilSize = $scope.boilsize && JSON.parse($scope.boilsize);
        boilSize = $scope.size && 1.36 * batchSize;
        efficiency = $scope.efficiency && JSON.parse($scope.efficiency);
        equipment = $scope.equipment && JSON.parse($scope.equipment);

        grav = gravity.calculateGravity(getFermentables(), getSizes(), yeast, boilSize, batchSize, efficiency, equipment);

        $scope.og = utils.round(grav.og);
        $scope.fg = utils.round(grav.fg);
        $scope.abv = gravity.calculateAbv(grav);
    }, true);

    // Watch for IBU change
    $scope.$watch('[fermentablesarr, hopsarr, boilsize, size, time, equipment]', function () {
        var boilSize, batchSize, time, equipment;
        var tmp;

        batchSize = $scope.size && JSON.parse($scope.size);
        // TODO: get input for boil size
//        boilSize = $scope.boilsize && JSON.parse($scope.boilsize);
        boilSize = $scope.size && 1.36 * batchSize;
        time = $scope.time && JSON.parse($scope.time);
        equipment = $scope.equipment && JSON.parse($scope.equipment);

        tmp = ibu.calculateIbu(getHops(), getHopsSizes(), getHopsTimes(), getFermentables(), getSizes(), boilSize, batchSize, time, $scope.og, equipment);
        $scope.ibu = utils.round(tmp);
    }, true);

    $scope.$watch('style', function (style) {
        if (style) {
            style = JSON.parse(style);

            var ogm = style.og.match(/^([0-9\.]+)-([0-9\.]+)\+?$/);
            $scope.oglow = parseFloat(ogm[1]);
            $scope.oghi = parseFloat(ogm[2]) / 1000 + 1;

            var fgm = style.fg.match(/^([0-9\.]+)-([0-9\.]+)\+?$/);
            $scope.fglow = parseFloat(fgm[1]);
            $scope.fghi = parseFloat(fgm[2]) / 1000 + 1;

            var ibum = style.ibu.match(/^([0-9\.]+)-([0-9\.]+)\+?$/);
            $scope.ibulow = parseFloat(ibum[1]);
            $scope.ibuhi = parseFloat(ibum[2]);

            var srmm = style.srm.match(/^([0-9\.]+)-([0-9\.]+)\+?$/);
            $scope.srmlow = parseFloat(srmm[1]);
            $scope.srmhi = parseFloat(srmm[2]);

            $scope.abvlow = gravity.calculateAbv({
                og: $scope.oglow,
                fg: $scope.fglow
            });

            $scope.abvhi = gravity.calculateAbv({
                og: $scope.oghi,
                fg: $scope.fghi
            });
        }
    });

    function getFermentables () {
        return _.map($scope.fermentablesarr, function (f) {
            return JSON.parse(f.fermentable || '{}');
        });
    }

    function getSizes () {
        return _.map($scope.fermentablesarr, function (f) {
            return parseInt(f.size);
        });
    }

    function getHops () {
        return _.map($scope.hopsarr, function (h) {
            return JSON.parse(h.hop || '{}');
        });
    }

    function getHopsSizes () {
        return _.map($scope.hopsarr, function (h) {
            return parseInt(h.size);
        });
    }

    function getHopsTimes () {
        return _.map($scope.hopsarr, function (h) {
            return parseInt(h.time);
        });
    }
}]);
