var NO_JOSTEINAJ = NO_JOSTEINAJ || {};

NO_JOSTEINAJ.arduino = function() {

    return {
        init: function() {

            var ps = require('child_process').spawn('sleep', ['2']);

            ps.stdout.on('data', function(data) {
                console.log('stdout: ' + data);
            });

            ps.stderr.on('data', function(data) {
                console.log('stderr: ' + data);
            });

            ps.on('close', function(code) {
                // if (code !== 0) {
                    console.log('child process exited with code ' + code);
                // }
                ps.stdin.end();
                NO_JOSTEINAJ.arduino.init();
            });
        }

    };
}();

NO_JOSTEINAJ.arduino.init();
