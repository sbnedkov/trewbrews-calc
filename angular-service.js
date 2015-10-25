import calculator from './src/calculator';

var app = angular.module('trewbrews', []);

app.service('TrewbrewsCalculator', () => {
    return function () {
        return {
            calculate: (input, cb) => {
                return calculator.calculate(input, cb);
            }
        };
    };
});
