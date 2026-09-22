# GamePad only: A shows X, B shows Y. C activates feedback while held.

def on_button_pressed_a():
    basic.show_number(stelrEV.joystick_raw(stelrEV.JoystickAxis.X))
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    basic.show_number(stelrEV.joystick_raw(stelrEV.JoystickAxis.Y))
input.on_button_pressed(Button.B, on_button_pressed_b)

def on_gamepad_button_c_pressed():
    stelrEV.gamepad_feedback(100)
stelrEV.on_gamepad_button(stelrEV.GamepadButton.C,
    stelrEV.GamepadEvent.PRESSED,
    on_gamepad_button_c_pressed)

def on_gamepad_button_c_released():
    stelrEV.gamepad_feedback(0)
stelrEV.on_gamepad_button(stelrEV.GamepadButton.C,
    stelrEV.GamepadEvent.RELEASED,
    on_gamepad_button_c_released)
