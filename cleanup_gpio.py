import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
LED = 23
ledState = False

GPIO.setup(LED,GPIO.OUT)

#ledState = not ledState
GPIO.output(LED, ledState)
GPIO.cleanup()