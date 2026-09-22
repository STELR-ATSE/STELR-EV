# Robot: raise the wheels before testing. A runs M1 briefly; B stops all motors.

def on_button_pressed_a():
    stelrEV.motor_run(stelrEV.Motors.M1, stelrEV.Dir.CW, 80)
    basic.pause(500)
    stelrEV.motor_stop(stelrEV.Motors.M1)
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    stelrEV.motor_stop_all()
input.on_button_pressed(Button.B, on_button_pressed_b)
