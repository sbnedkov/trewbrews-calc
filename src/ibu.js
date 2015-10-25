import utils from './utils';

export default {
    calculateIbu: function (recipe, og) {
        var hops = recipe.hops.filter(function (hop) {
            return hop.alpha;
        });

        var gravity = boilGravity(recipe, og);

        return hops.reduce(function (acc, hop) {
            return acc + ibuFromHop(hop, recipe.batchSize, gravity) / hops.length;
        }, 0);
    }
};

function ibuFromHop (hop, batchSize, gravity) {
    return 1.65 * Math.pow(0.000125, gravity - 1) * ((1 - Math.pow(Math.E, -0.04 * hop.time)) / 4.15) *
        (isPellet(hop) ? 1.1 : 1) *
        (((hop.alpha / 100) * utils.gramsToOz(hop.grams) * 7490) / utils.litersToGallons(batchSize));
}

function boilGravity (recipe, og) {
    return ((recipe.batchSize / recipe.boilSize) * (og - 1) + 1);
}

function isPellet (hop) {
    return hop.type === 'Pellet';
}
