const rpi_gpio_buttons = require('rpi-gpio-buttons');
const buttons = rpi_gpio_buttons([4], { mode: rpi_gpio_buttons.MODE_BCM });

let clickCount = 0;

buttons.setTiming({ pressed: 10 });
// bind to the clicked event and check for the assigned pins when clicked
buttons.on('button_press', function (pin) {
  userClicked( pin );
});

function userClicked( pin ) {
  clickCount++;
  console.log( 'pressed: ',pin, clickCount );
}