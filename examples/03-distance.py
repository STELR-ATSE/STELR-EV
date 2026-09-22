# Robot only: initialise after power-up. A reads front, B reads rear.
stelrEV.initialise_distance_sensors()
if stelrEV.distance_sensors_ready():
    basic.show_string("OK")
else:
    basic.show_string("INIT")

def on_button_pressed_a():
    distance = stelrEV.read_distance(stelrEV.DistanceSensor.FRONT)
    if stelrEV.distance_reading_valid(stelrEV.DistanceSensor.FRONT):
        basic.show_number(distance)
    else:
        basic.show_string("ERR")
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    distance2 = stelrEV.read_distance(stelrEV.DistanceSensor.REAR)
    if stelrEV.distance_reading_valid(stelrEV.DistanceSensor.REAR):
        basic.show_number(distance2)
    else:
        basic.show_string("ERR")
input.on_button_pressed(Button.B, on_button_pressed_b)
