var trewbrews = angular.module('trewbrews');

trewbrews.service('polynomial', [function (utils) {
    var polynomial = function (coeffs) {
        this.coeffs = coeffs;
    };

    polynomial.prototype.evaluate = function (x) {
        var res = 0;
        var maxPower = this.coeffs.length - 1;

        _.each(this.coeffs, function (coeff) {
            res += coeff * Math.pow(x, maxPower--);
        });

        return res;
    };

    polynomial.prototype.root = function (low, high) {
        var guess;
        var maxSeparation = Math.abs(high - low) * 1e3;

        while (Math.abs(high - low) > 0.0000001) {
            guess = high  - (high - low) * this.evaluate(high) / (this.evaluate(high) + this.evaluate(low));

            low = high;
            high = guess;

            if (Math.abs(high - low) > maxSeparation) {
                return 1e21;
            }
        }

        return guess;
    };

    return polynomial;
}]);
