const rpi_gpio_buttons = require('rpi-gpio-buttons');
const tsl2591 = require('tsl2591');
const gpio = require('rpi-gpio');

let gpiop = gpio.promise;
gpio.setMode( gpio.MODE_BCM );

class App {

  constructor( config ) {

  	this.configs = config;

  	this.sensor_ready = false;
  	this.leds_ready = false;

  	this.buttons = rpi_gpio_buttons( config.button_gpios, { mode: rpi_gpio_buttons.MODE_BCM });
  	this.buttons.setTiming({ pressed: 10 });

  	this.leds = gpio.promise;
  	gpio.setMode( gpio.MODE_BCM );

  	this.leds.setup( config.led_gpios.active, gpio.DIR_OUT ).then( () => {
	  	console.log('LEDs ready!',config.led_gpios.active);
	  	this.leds_ready = true;
	  }).catch( err => {
	      console.log('Error: ', err.toString() );
	  });

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
  	//TODO make sure state is ready
  	console.log( 'pressed: ',pin );
  	if( this.sensor_ready && this.leds_ready ){
  		this.leds.write( this.configs.led_gpios.active, true );
  		this.takeReadings( ( err, data ) => {
  			this.leds.write( this.configs.led_gpios.active, false );
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

  takeReadings( cb ){

  	async.times( this.configs.readings, ( n, next ) => {
  		this.takeReading( ( err, result ) => {
  			next( err, result );
  		});
		}, ( err, results ) => {
			cb( err, results );
		});

  }

  takeReading( cb ){

  	this.lux_sensor.readLuminosity( ( err, data ) => {
			setTimeout( () => { this.leds.write( this.configs.led_gpios.active, false ) },500 );
			//this.leds.write( this.configs.led_gpios.active, false );
      if (err) {
          console.log(err);
      } else {
          console.log(data);
      }
    });

  }

}


let app = new App({
	button_gpios: [4],
	led_gpios:{
		active: 17
	},
	lux_sensor: {
		AGAIN: 0,
		ATIME: 1
	},
	readings: 20
});