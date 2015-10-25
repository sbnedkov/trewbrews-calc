import angular from 'angular';
import calculator from './src/calculator';

var app = angular.module('trewbrews', []);

app.service('TrewbrewsCalculator', () => {
    return {
        calculate: (input, cb) => {
            return calculator.calculate(input, cb);
        }
    };
});
