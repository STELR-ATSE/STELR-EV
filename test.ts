// Compile/Blocks coverage. Callbacks are not invoked at startup.
function motorBlockCoverage() {
    stelrEV.MotorRun(stelrEV.Motors.M1, stelrEV.Dir.CW, 80)
    stelrEV.motorStop(stelrEV.Motors.M1)
    stelrEV.motorStopAll()
    stelrEV.servo(stelrEV.Servos.S1, 90)
    stelrEV.stepperDegree_42(stelrEV.Steppers.M1_M2, stelrEV.Dir.CW, 90)
    stelrEV.stepperTurn_42(stelrEV.Steppers.M1_M2, stelrEV.Dir.CW, 1)
    stelrEV.stepperDegree_28(stelrEV.Steppers.M3_M4, stelrEV.Dir.CCW, 90)
    stelrEV.stepperTurn_28(stelrEV.Steppers.M3_M4, stelrEV.Dir.CCW, 1)
    stelrEV.stepperDegreeDual_42(stelrEV.Stepper.Ste1, stelrEV.Dir.CW, 90, stelrEV.Dir.CCW, 90)
    stelrEV.stepperTurnDual_42(stelrEV.Stepper.Ste2, stelrEV.Dir.CW, 1, stelrEV.Dir.CCW, 1)
}
function gamepadBlockCoverage() {
    let x = stelrEV.joystickRaw(stelrEV.JoystickAxis.X)
    let y = stelrEV.joystickRaw(stelrEV.JoystickAxis.Y)
    if (stelrEV.gamepadButtonPressed(stelrEV.GamepadButton.F)) {
        stelrEV.gamepadFeedback(100)
    }
    basic.showNumber(x + y)
}
function distanceBlockCoverage() {
    let front = 0
    let rear = 0
    stelrEV.initialiseDistanceSensors()
    if (stelrEV.distanceSensorsReady()) {
        front = stelrEV.readDistance(stelrEV.DistanceSensor.Front)
        rear = stelrEV.readDistance(stelrEV.DistanceSensor.Rear)
        if (stelrEV.distanceReadingValid(stelrEV.DistanceSensor.Front)) {
            basic.showNumber(front)
        }
        if (stelrEV.distanceReadingValid(stelrEV.DistanceSensor.Rear)) {
            basic.showNumber(rear)
        }
    }
}
stelrEV.onGamepadButton(stelrEV.GamepadButton.C, stelrEV.GamepadEvent.Pressed, function () {
    gamepadBlockCoverage()
})
// Reachable for compiler coverage, but requires deliberate input.
input.onButtonPressed(Button.A, function () {
    motorBlockCoverage()
})
input.onButtonPressed(Button.B, function () {
    distanceBlockCoverage()
})
