// Robot: the standard kit uses three outputs of the five-channel array.
// No STELR EV helper is needed to read these analogue values.
basic.forever(function () {
    serial.writeValue("left", pins.analogReadPin(AnalogPin.P0))
    serial.writeValue("centre", pins.analogReadPin(AnalogPin.P1))
    serial.writeValue("right", pins.analogReadPin(AnalogPin.P2))
    basic.pause(100)
})
