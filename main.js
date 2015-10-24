import utils from './src/utils';
import srm from './src/srm';
import ibu from './src/ibu';
import gravity from './src/gravity';

// Defaults
var batchSize = 21;
var time = 60;
var efficiency = 75;

process.stdin.setEncoding('utf8');

var inputData = '';
process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        inputData += chunk;
    }
});

process.stdin.on('end', function() {
    calculate(inputData, function (err, res) {
        if (err) {
            return process.stdout.write(JSON.stringify(err));
        }

        process.stdout.write(JSON.stringify(res));
    });
});

function calculate (inputData, callback) {
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
