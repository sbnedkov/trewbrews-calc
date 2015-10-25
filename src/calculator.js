import utils from './utils';
import srm from './srm';
import ibu from './ibu';
import gravity from './gravity';

// Defaults
var batchSize = 21;
var time = 60;
var efficiency = 75;

export default {
    calculate: function (inputData, callback) {
        var recipe;
        var result = {
            og: 0,
            fg: 0,
            ibu: 0,
            abv: 0,
            srm: 0
        };

        try {
            recipe = JSON.parse(inputData);
        } catch (err) {
            return callback(err);
        }

        recipe.batchSize || (recipe.batchSize = batchSize);
        recipe.boilSize || (recipe.boilSize = 1.36 * recipe.batchSize);
        recipe.time || (recipe.time = time);
        recipe.efficiency || (recipe.efficiency = efficiency);

        result.srm = srm.calculateSrm(recipe);

        var grav = gravity.calculateGravity(recipe);
        result.og = utils.round(grav.og);
        result.fg = utils.round(grav.fg);
        result.abv = gravity.calculateAbv(grav);

        result.ibu = utils.round(ibu.calculateIbu(recipe, result.og));

        callback(null, result);
    }
};
