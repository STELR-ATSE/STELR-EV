// GamePad only: A shows X, B shows Y. C activates feedback while held.
input.onButtonPressed(Button.A, function () {
    basic.showNumber(stelrEV.joystickRaw(stelrEV.JoystickAxis.X))
})
input.onButtonPressed(Button.B, function () {
    basic.showNumber(stelrEV.joystickRaw(stelrEV.JoystickAxis.Y))
})
stelrEV.onGamepadButton(stelrEV.GamepadButton.C, stelrEV.GamepadEvent.Pressed, function () {
    stelrEV.gamepadFeedback(100)
})
stelrEV.onGamepadButton(stelrEV.GamepadButton.C, stelrEV.GamepadEvent.Released, function () {
    stelrEV.gamepadFeedback(0)
})
