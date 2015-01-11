var trewbrews = angular.module('trewbrews');

trewbrews.service('gravity', ['utils', function (utils) {
    var _ = window._;
    var gravity = {
    };

    function pointsPerGallon (fermentables, sizes, batchSize, efficiency) {
        var ppg = 0;
        var batchSizeGallons = utils.litersToGallons(batchSize);
        _.each(fermentables, function (fermentable, idx) {
            var sizeLbs = utils.kgsToLbs(sizes[idx]);
            ppg += ((fermentable.ppg - 1) * 1000 * sizeLbs * efficiency / 100) / batchSizeGallons;
        });

        return ppg;
    }

    gravity.calculateGravity = function (fermentables, sizes, yeasts, boilSize, size, efficiency) {
        fermentables = _.filter(fermentables, function (fermentable) {
            return fermentable;
        });

        var og, fg;
        var attenuation = 0;
        var p = pointsPerGallon(fermentables, sizes, size, efficiency);

        og = p / 1000 + 1;

        // FG
        _.each(yeasts, function (yeast) {
            if (yeast.attenuation > attenuation) {
                attenuation = yeast.attenuation;
            }
        });

        if (attenuation <= 0) {
            attenuation = 75;
        }

        fg = 1 + ((100 - attenuation) / 100) * (og - 1);

        return {
            og: og,
            fg: fg
        };
    };

    gravity.calculateAbv = function (grav) {
        return utils.round(131 * (grav.og - grav.fg));
    };

    return gravity;
}]);
