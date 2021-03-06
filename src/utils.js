export default {
    kgsToLbs: function (kgs) {
        return kgs * 2.2046;
    },
    litersToGallons: function (liters) {
        return liters * 0.26417;
    },
    gramsToOz: function (grams) {
        return grams * 0.0352739619;
    },
    round: function (n, d = 3) {
        return Math.round(Math.pow(10, d) * n) / Math.pow(10, d);
    }
};
