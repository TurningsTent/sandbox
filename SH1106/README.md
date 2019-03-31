## EXAMPLES

https://github.com/rm-hull/luma.examples

The above URL also contains the install steps for installing luma drivers and libraries. Works on RPI 3.

## WIRING

Enable SPI and 12C on the board.

Pinouts for SH1106 128x64 SPI are:


| Display | Descr  | BCM | PIN       |
|---------|--------|-----|-----------|
| GND     | Ground | 6   | Ground    |
| VCC     | 3.3V   | 1   | 3.3 Volts |
| CLK     | Clock  | 23  | SCLK      |
| MOSI    | Data   | 19  | SPI0 MOSI |
| RES     | Reset  | 22  | GPIO25    |
| DC      |        | 18  | GPIO24    |
| CS      | CE0    | 24  | CE0_SPI   |
