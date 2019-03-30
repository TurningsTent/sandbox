var rpi_gpio_buttons = require('rpi-gpio-buttons');
var buttons = rpi_gpio_buttons([4,18,23], { mode: rpi_gpio_buttons.MODE_BCM });

console.log('Waiting for button clicks');

// bind to the clicked event and check for the assigned pins when clicked
buttons.on('button_press', function (pin) {
  userClicked( pin );
});


function userClicked( pin ) {
  console.log( 'pressed: ',pin );
}