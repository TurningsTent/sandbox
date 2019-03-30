var rpi_gpio_buttons = require('rpi-gpio-buttons');
var buttons = rpi_gpio_buttons([4], { mode: rpi_gpio_buttons.MODE_BCM });

let count = 0;
let clickCount = 0;

console.log('Waiting for button clicks');

buttons.setTiming({ pressed: 100 });
// bind to the clicked event and check for the assigned pins when clicked
buttons.on('button_press', function (pin) {
  userClicked( pin );
});


setInterval( () => {
  count++;
  console.log( count );
}, 100 );

function userClicked( pin ) {
  clickCount++;
  console.log( 'pressed: ',pin, clickCount );
}