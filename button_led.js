var gpio = require('rpi-gpio');
var rpi_gpio_buttons = require('rpi-gpio-buttons');

var gpiop = gpio.promise;
gpio.setMode( gpio.MODE_BCM );
var buttons = rpi_gpio_buttons([4], { mode: rpi_gpio_buttons.MODE_BCM });

let count = 0;
let clickCount = 0;
let led_state = false;

buttons.setTiming({ pressed: 100 });

gpiop.setup( 23, gpio.DIR_OUT)
  .then(() => {
  	buttons.on('button_press', function (pin) {
		  userClicked( pin );
		});
  })
  .catch((err) => {
      console.log('Error: ', err.toString())
  });

function userClicked( pin ) {
	if( !led_state ){
	  clickCount++;
	  led_state = !led_state;
	  console.log( 'pressed: ',pin, clickCount, led_state );
	  gpiop.write( 23, led_state );
	  setTimeout(()=>{
	  	led_state = !led_state;
	  	gpiop.write( 23, led_state );
	  }, 3000 );
	}
}