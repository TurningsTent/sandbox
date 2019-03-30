var rpi_gpio_buttons = require('rpi-gpio-buttons');
var buttons = rpi_gpio_buttons([18,13], { mode: rpi_gpio_buttons.MODE_BCM });

console.log('Waiting for button clicks');

// bind to the clicked event and check for the assigned pins when clicked
buttons.on('clicked', function (pin) {
  switch(pin) {
    // Up button on pin 11 was clicked
    case 18:
    userClickedUp();
    break
    // Down button on pin 13 was clicked
    case 13:
    userClickedDown();
    break;
  }
});


function userClickedUp() {
  // do something here for up button
  console.log('UP');
}


function userClickedDown() {
  // do something here for down button
  console.log('DOWN');
}