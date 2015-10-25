import utils from './utils';

export default {
    calculateGravity: function (recipe) {
        var og, fg;
        var attenuation = recipe.yeast.attenuation;
        var p = pointsPerGallon(recipe.fermentables, recipe.batchSize, recipe.efficiency);

        og = p / 1000 + 1;

        // FG
        if (attenuation <= 0) {
            attenuation = 75;
        }

        fg = 1 + ((100 - attenuation) / 100) * (og - 1);

        return {
            og: og,
            fg: fg
        };
    },
    calculateAbv: function (grav) {
        return utils.round((grav.og - grav.fg) * (125 * 1.05));
    }
};

function pointsPerGallon (fermentables, batchSize, efficiency) {
    var batchSizeGallons = utils.litersToGallons(batchSize);
    return fermentables.reduce(function (acc, fermentable) {
        var lbs = utils.kgsToLbs(fermentable.kgs);
        if (mashable(fermentable)) { // Efficiency counts only for mashable fermentables
            acc += ((fermentable.ppg - 1) * 1000 * lbs * (efficiency / 100)) / batchSizeGallons;
        } else {
            acc += ((fermentable.ppg - 1) * 1000 * lbs) / batchSizeGallons;
        }
        return acc;
    }, 0);
}

function mashable (fermentable) {
    return fermentable.type === 'Grains';
}
