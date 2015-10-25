import calc from './src/calculator';

process.stdin.setEncoding('utf8');

var inputData = '';
process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        inputData += chunk;
    }
});

process.stdin.on('end', function() {
    calc.calculate(inputData, function (err, res) {
        if (err) {
            return process.stdout.write(JSON.stringify(err));
        }

        process.stdout.write(JSON.stringify(res));
    });
});
