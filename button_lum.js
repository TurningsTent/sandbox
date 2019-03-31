const rpi_gpio_buttons = require('rpi-gpio-buttons');
const tsl2591 = require('tsl2591');
const gpio = require('rpi-gpio');
const async = require('async');
const _ = require('underscore');

let gpiop = gpio.promise;
gpio.setMode( gpio.MODE_BCM );

class App {

  constructor( config ) {

  	this.configs = config;

  	this.states = {
  		reading: false,
  		sensor_ready: false,
  		leds_ready: false
  	};

  	this.buttons = rpi_gpio_buttons( config.button_gpios, { mode: rpi_gpio_buttons.MODE_BCM });
  	this.buttons.setTiming({ pressed: 10 });

  	this.leds = gpio.promise;
  	gpio.setMode( gpio.MODE_BCM );

  	Promise.all([
  		this.leds.setup( config.led_gpios.active, gpio.DIR_OUT ),
  		this.leds.setup( config.led_gpios.ready, gpio.DIR_OUT )
  	]).then( () => {
	  	console.log('LEDs ready!',config.led_gpios );
	  	this.leds.write( this.configs.led_gpios.ready, true );
	  	this.states.leds_ready = true;
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
        this.states.sensor_ready = true;
	    }
		});

  }

  onButtonPress( pin ){
  	//TODO make sure state is ready
  	console.log( 'pressed: ',pin );
  	if( this.states.sensor_ready && this.states.leds_ready && !this.states.reading ){
  		this.states.reading = true;
  		this.leds.write( this.configs.led_gpios.ready, false );
  		this.leds.write( this.configs.led_gpios.active, true );
  		this.takeReadings( ( err, data ) => {
  			this.leds.write( this.configs.led_gpios.ready, true );
  			this.leds.write( this.configs.led_gpios.active, false );
  			if (err) {
	          console.log(err);
	      } else {
	      	this.states.reading = false;
	          console.log(data);
	      }
  		});
  	} else {
  		console.log("Cannot take reading at this time");
  	}

  }

  averageResults( results ){

  	let sums = _.reduce( results, ( memo, reading ) => {
  		memo.vis_ir += reading.vis_ir;
  		memo.ir += reading.ir;
  		return memo;
  	}, {
			vis_ir: 0,
			ir: 0
		});

		return {
			vis_ir: ( sums.vis_ir / results.length ).toFixed(2),
			ir: ( sums.ir / results.length ).toFixed(2)
		}

  }

  takeReadings( cb ){

  	async.timesSeries( this.configs.readings, ( n, next ) => {
  		console.log( n+' / '+this.configs.readings );
  		this.takeReading( ( err, result ) => {
  			setTimeout( () => {
  				next( err, result );
  			}, this.configs.reading_timeout );
  		});
		}, ( err, results ) => {
			cb( err, this.averageResults( results ) );
		});

  }

  takeReading( cb ){

  	this.lux_sensor.readLuminosity( ( err, data ) => {
  		console.log( data );
      cb( err, data );
    });

  }

}


let app = new App({
	button_gpios: [4],
	led_gpios:{
		active: 17,
		ready: 16
	},
	lux_sensor: {
		AGAIN: 2,
		ATIME: 1
	},
	readings: 50,
	reading_timeout: 100
});

process.stdin.resume(); //TO ALLOW FOR CLEANUP
process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}