var trewbrews = angular.module('trewbrews');

trewbrews.service('gravity', ['utils', function (utils) {
    var gravity = {
    };

    function equivSucroseInKg (fermentable, sizeKg) {
        // TODO: if type is grain and is not mashed reduce by multiplying by 0.60
        return fermentable.yield * sizeKg * (1 - fermentable.moisture / 100) / 100;
    }

    function pointsPerGallon (fermentables, sizes) {
        var sugarKgIgnoreEfficiency = 0;
        var sugarKg = 0;
        var nonFermentableSugarKg = 0;

        _.each(fermentables, function (fermentable, idx) {
             // TODO: if preboil and not is mashed - continue
             if (fermentable.ftype === "Sugar" || fermentable.ftype === "Extract") {
                 sugarKgIgnoreEfficiency += equivSucroseInKg(fermentable, sizes[idx]);
                 if (fermentable.ftype !== "Sugar") {
                     nonFermentableSugarKg += equivSucroseInKg(fermentable, sizes[idx]);
                 }
             } else {
                 sugarKg += equivSucroseInKg(fermentable, sizes[idx]);
             }
        });

        return {
            sugarKgIgnoreEfficiency: sugarKgIgnoreEfficiency,
            sugarKg: sugarKg,
            nonFermentableSugarKg: nonFermentableSugarKg
        };
    }

    gravity.calculateVolume = function (boilSize, batchSize, fermentables, sizes) {
        var vol = 0, finalVolume, finalVolumeNoLosses, postBoilVolume;

        _.each(fermentables, function (fermentable, idx) {
            if (fermentable.ftype === "Extract") {
                vol += sizes[idx] / 1.412;
            } else if (fermentable.ftype === "Sugar") {
                vol += sizes[idx] / 1.587;
            } else if (fermentable.ftype === "Dry Extract") {
                vol += sizes[idx] / 1.587;
            }
        });

        if (vol === 0) {
            vol = boilSize;
        }

        finalVolumeNoLosses = batchSize;

        // TODO: use equipment
        finalVolume = vol - 4;

        // TODO: use equipment
        postBoilVolume = batchSize;

        return {
            finalVolume: finalVolume,
            finalVolumeNoLosses: finalVolumeNoLosses
        };
    };

    gravity.calculateGravity = function (fermentables, sizes, yeasts, boilSize, size, efficiency) {
        var og, fg;
        var sugarKg;
        var plato;
        fermentables = _.filter(fermentables, function (fermentable) {
            return fermentable;
        });
        var finalVolumeNoLosses = gravity.calculateVolume(boilSize, size, fermentables, sizes).finalVolumeNoLosses;
        var points, fermPoints, fermKg, ogFermentable, fgFermentable;
        var attenuation = 0;
        var ppg = pointsPerGallon(fermentables, sizes);

        yeasts = yeasts ? [yeasts] : [];

        // TODO: implement equipment dependent

        sugarKg = ppg.sugarKg * efficiency / 100 + ppg.sugarKgIgnoreEfficiency;
        plato = utils.plato(sugarKg, finalVolumeNoLosses);

        og = utils.platoToSg(plato);

        points = (og - 1) * 1000;

        if (ppg.nonFermentableSugarKg !== 0) {
            fermKg = ppg.sugarKg - ppg.nonFermentableSugarKg;
            plato = utils.plato(fermKg, finalVolumeNoLosses);
            ogFermentable = utils.platoToSg(plato);
            plato = utils.plato(ppg.nonFermentableSugarKg, finalVolumeNoLosses);
            fermPoints = (utils.platoToSg(plato) - 1) * 1000;
        } else {
            ogFermentable = og;
            fermPoints = 0;
        }

        // FG
        _.each(yeasts, function (yeast) {
            if (yeast.attenuation > attenuation) {
                attenuation = yeast.attenuation;
            }
        });

        if (yeasts.length > 0 && attenuation <= 0) {
            attenuation = 75;
        }

        if (ppg.nonFermentableSugarKg !== 0) {
            fermPoints = (points - fermPoints) * (1 - attenuation / 100);
            points *= (1 - attenuation / 100);
            fg = 1 + points / 1000;
            fgFermentable = 1 + fermPoints / 1000;
        } else {
            points *= (1 - attenuation/100);
            fg = 1 + points / 1000;
            fgFermentable = fg;
        }

        return {
            og: og,
            fg: fg
        };
    };

    gravity.calculateAbv = function (grav) {
        return 130 * (grav.og - grav.fg);
    };

    return gravity;
}]);
