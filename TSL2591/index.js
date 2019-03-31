var tsl2591 = require('tsl2591');

/* Use /dev/i2c-0 on older Raspis */
/* Note the options are passed directly to the i2c module */
var light = new tsl2591({device: '/dev/i2c-1'});

light.init({AGAIN: 0, ATIME: 1}, function(err) {
    if (err) {
        console.log(err);
        process.exit(-1);
    }
    else {
        console.log('TSL2591 ready');
        setInterval(function() {
            light.readLuminosity(function(err, data) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(data);
            }
            });
        }, 1000);
    }
});