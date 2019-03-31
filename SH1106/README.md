## EXAMPLES

https://github.com/rm-hull/luma.examples

The above URL also contains the install steps for installing luma drivers and libraries. Works on RPI 3.

## WIRING

Enable SPI and 12C on the board.

Pinouts for SH1106 128x64 SPI are:

```
Display Descr. 		BCM	Pin
GND 		Ground 		6 	Ground
VCC 		3.3 V 		1 	3.3 volts
CLK 		Clock 		23 	SCLK
MOSI 		Data 			19 	SP10 MOSI
RES 		Reset 		22 	(GP IO25)
DC 								18 	(GP IO24)
CS 			CE0 			24 	CE0 (SPI)
```
