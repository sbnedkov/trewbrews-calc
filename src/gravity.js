var trewbrews = angular.module('trewbrews');

trewbrews.service('gravity', ['utils', function (utils) {
    var gravity = {
    };

    function equivSucroseInKg (fermentable, sizeKg) {
        var ret = fermentable.yield * sizeKg * (1 - fermentable.moisture / 100) / 100;

        if (fermentable.ftype === "Grain" && !fermentable.is_mashed) {
            return 0.60 * ret;
        } else {
            return ret;
        }
    }

    function pointsPerGallon (fermentables, sizes, preboil) {
        var sugarKgIgnoreEfficiency = 0;
        var sugarKg = 0;
        var nonFermentableSugarKg = 0;

        _.each(fermentables, function (fermentable, idx) {
            if (preboil && !fermentable.is_mashed) {
                // nothing
            } else {
                if (fermentable.ftype === "Sugar" || fermentable.ftype === "Extract") {
                    sugarKgIgnoreEfficiency += equivSucroseInKg(fermentable, sizes[idx]);
                    if (fermentable.ftype !== "Sugar") {
                        nonFermentableSugarKg += equivSucroseInKg(fermentable, sizes[idx]);
                    }
                } else {
                    sugarKg += equivSucroseInKg(fermentable, sizes[idx]);
                }
            }
        });

        return {
            sugarKgIgnoreEfficiency: sugarKgIgnoreEfficiency,
            sugarKg: sugarKg,
            nonFermentableSugarKg: nonFermentableSugarKg
        };
    }

    gravity.calculateVolume = function (boilSize, batchSize, fermentables, sizes, equipment) {
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

        if (vol <= 0) {
            vol = boilSize;
        }

        finalVolumeNoLosses = batchSize;

        if (equipment) {
            finalVolume = wortEndOfBoil(equipment, vol) + equipment.top_up_water - equipment.trub_chiller_loss;
        } else {
            finalVolume = vol - 4;
        }

        if (equipment) {
            postBoilVolume = wortEndOfBoil(equipment, vol);
        } else {
            postBoilVolume = batchSize;
        }

        return {
            finalVolume: finalVolume,
            finalVolumeNoLosses: finalVolumeNoLosses
        };
    };

    function wortEndOfBoil (equipment, kettleWortLitres) {
        return kettleWortLitres - (equipment.boil_time / 60) * equipment.real_evap_rate;
    }

    gravity.calculateGravity = function (fermentables, sizes, yeasts, boilSize, size, efficiency, equipment) {
        var og, fg;
        var sugarKg;
        var plato;
        fermentables = _.filter(fermentables, function (fermentable) {
            return fermentable;
        });
        var finalVolumeNoLosses = gravity.calculateVolume(boilSize, size, fermentables, sizes, equipment).finalVolumeNoLosses;
        var points, fermPoints, fermKg, ogFermentable, fgFermentable;
        var attenuation = 0;
        var ppg = pointsPerGallon(fermentables, sizes, false);
        var sugarKgIgnoreEfficiency = ppg.sugarKgIgnoreEfficiency, nonFermentableSugarKg = ppg.nonFermentableSugarKg;

        var kettleWortLitres, postBoilWortLitres, ratio;

        yeasts = yeasts ? [yeasts] : [];

        if (equipment) {
            // TODO: in volume calculations (function above) - use mash values to caclulate wort from mash
            kettleWortLitres = /* wortFromMash */ - equipment.lauter_deadspace + equipment.top_up_kettle;
            postBoilWortLitres = wortEndOfBoil(equipment, kettleWortLitres);
            ratio = (postBoilWortLitres - equipment.trub_chiller_loss) / postBoilWortLitres;

            if (ratio > 1.0) {
                ratio = 1.0;
            } else if (ratio < 0.0) {
                ratio = 0.0;
            } else if (ratio !== ratio) {
                ratio = 1.0;
            }

            sugarKgIgnoreEfficiency *= ratio; 
            if (nonFermentableSugarKg !== 0.0) {
                nonFermentableSugarKg *= ratio;
            }
        }

        sugarKg = ppg.sugarKg * efficiency / 100 + sugarKgIgnoreEfficiency;
        plato = utils.plato(sugarKg, finalVolumeNoLosses);

        og = utils.platoToSg(plato);

        points = (og - 1) * 1000;

        if (nonFermentableSugarKg !== 0) {
            fermKg = ppg.sugarKg - nonFermentableSugarKg;
            plato = utils.plato(fermKg, finalVolumeNoLosses);
            ogFermentable = utils.platoToSg(plato);
            plato = utils.plato(nonFermentableSugarKg, finalVolumeNoLosses);
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

        if (nonFermentableSugarKg !== 0) {
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
