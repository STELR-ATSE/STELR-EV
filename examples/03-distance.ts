// Robot only: initialise after power-up. A reads front, B reads rear.
stelrEV.initialiseDistanceSensors()
if (stelrEV.distanceSensorsReady()) {
    basic.showString("OK")
} else {
    basic.showString("INIT")
}
input.onButtonPressed(Button.A, function () {
    let distance = stelrEV.readDistance(stelrEV.DistanceSensor.Front)
    if (stelrEV.distanceReadingValid(stelrEV.DistanceSensor.Front)) {
        basic.showNumber(distance)
    } else {
        basic.showString("ERR")
    }
})
input.onButtonPressed(Button.B, function () {
    let distance = stelrEV.readDistance(stelrEV.DistanceSensor.Rear)
    if (stelrEV.distanceReadingValid(stelrEV.DistanceSensor.Rear)) {
        basic.showNumber(distance)
    } else {
        basic.showString("ERR")
    }
})
