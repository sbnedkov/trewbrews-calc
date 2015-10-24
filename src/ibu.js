import utils from './utils';

export default {
    calculateIbu: function (recipe, og) {
        var hops = recipe.hops.filter(function (hop) {
            return hop.alpha;
        });
        // TODO: for malt extracts we have bitterness in the fermentables

        return hops.reduce(function (acc, hop) {
            return acc + ibuFromHop(hop, recipe.batchSize, og) / hops.length;
        }, 0);
    }
};

function ibuFromHop (hop, batchSize, og) {
    return 1.65 * Math.pow(0.000125, og - 1) * ((1 - Math.pow(Math.E, -0.04 * hop.time)) / 4.15) *
        (((hop.alpha / 100) * utils.gramsToOz(hop.grams) * 7490) / utils.litersToGallons(batchSize));
}
