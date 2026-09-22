// Robot: raise the wheels before testing. A runs M1 briefly; B stops all motors.
input.onButtonPressed(Button.A, function () {
    stelrEV.MotorRun(stelrEV.Motors.M1, stelrEV.Dir.CW, 80)
    basic.pause(500)
    stelrEV.motorStop(stelrEV.Motors.M1)
})
input.onButtonPressed(Button.B, function () {
    stelrEV.motorStopAll()
})
