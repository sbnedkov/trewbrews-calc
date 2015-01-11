var trewbrews = angular.module('trewbrews');

trewbrews.service('ibu', ['utils', function (utils) {
    var ibu = {
    };

    ibu.calculateIbu = function (hops, sizes, fermentables, fsizes, boilSize, batchSize, boilTime, og, equipment) {
        var ibus = 0;
        fermentables = _.filter(fermentables, function (fermentable) {
            return fermentable;
        });

        _.each(hops, function (hop, idx) {
            ibus += ibuFromHop(hop, sizes[idx], batchSize, boilTime, og, equipment);
        });

        // TODO: figure out if we have this data at all
//        _.each(fermentables, function (fermentable, idx) {
//            ibus += fermentable.ibu_gal_per_lb * (fsizes[idx] / batchSize) / 8.34538;
//        });

        return ibus;
    };

    function ibuFromHop (hop, size, batchSize, boilTime, og, equipment) {
        var AArating = hop.alpha / 100;
        var grams = size * 1000;
        var minutes = hop.time;
        var utilization = 1;
        var boilTime = 0;
        var ibus = 0;

        if (equipment) {
            utilization = equipment.hop_utilization / 100;
            boilTime = equipment.boil_time;
        }
         
        // TODO: there are two more cases for the hop use, but one is not present in the database, the other depends on equipment
        if (hop.use === 'Boil') {
            ibus = getIbus(AArating, size, batchSize, og, hop.time);
        }

        // TODO: there are two quotient for Leaf and Plug form hops, but none in the database
        ibus *= utilization;

        return ibus;
    }

    // 'Tinseth' method, there's 'Rager' too
    function getIbus (AArating, size, finalVolume, og, minutes) {
        return ((AArating * size * 1000) / finalVolume) * ((1.0 - Math.exp(-0.04 * minutes))/4.15) * (1.65 * Math.pow(0.000125, (og - 1)));
    }

    return ibu;
}]);
