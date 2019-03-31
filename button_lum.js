const rpi_gpio_buttons = require('rpi-gpio-buttons');
const tsl2591 = require('tsl2591');

class App {

  constructor( config ) {

  	this.sensor_ready = false;

  	this.buttons = rpi_gpio_buttons( config.button_gpios, { mode: rpi_gpio_buttons.MODE_BCM });
  	this.buttons.setTiming({ pressed: 10 });

  	this.lux_sensor = new tsl2591({device: '/dev/i2c-1'});

  	this.buttons.on('button_press', pin => {
		  this.onButtonPress( pin );
		});

		this.lux_sensor.init( config.lux_sensor, err => {
	    if ( err ) {
        console.log( err );
        //TODO show error on screen, make user restart
	    } else {
        console.log('TSL2591 ready');
        this.sensor_ready = true;
	    }
		});

  }

  onButtonPress( pin ){
  	console.log( 'pressed: ',pin, clickCount );
  	if( this.sensor_ready ){
  		this.lux_sensor.readLuminosity( ( err, data ) => {
	      if (err) {
	          console.log(err);
	      } else {
	          console.log(data);
	      }
	    });
  	} else {
  		console.log("Lux Sensor not ready yet");
  	}

  }

}


let app = new App({
	button_gpios: [4],
	lux_sensor: {
		AGAIN: 0,
		ATIME: 1
	}
});