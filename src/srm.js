import utils from './utils';

export default {
    calculateSrm: function (recipe) {
        var batchSizeGallons = utils.litersToGallons(recipe.batchSize);
        var mcu = recipe.fermentables.reduce(function (acc, f) {
            acc += (f.srm * utils.kgsToLbs(f.kgs)) / batchSizeGallons;
            return acc;
        }, 0);

        return utils.round(1.4922 * (Math.pow(mcu, 0.6859)));
    }
};
