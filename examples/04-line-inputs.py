# Robot: the standard kit uses three outputs of the five-channel array.
# No STELR EV helper is needed to read these analogue values.

def on_forever():
    serial.write_value("left", pins.analog_read_pin(AnalogPin.P0))
    serial.write_value("centre", pins.analog_read_pin(AnalogPin.P1))
    serial.write_value("right", pins.analog_read_pin(AnalogPin.P2))
    basic.pause(100)
basic.forever(on_forever)
