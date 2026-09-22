// DFR0536 V4.0 hardware support. Pin layout follows DFRobot's V4 wiki.
// Unlike the older pxt-gamePad, P1/P2 are analogue and P16 is button F.
namespace stelrEV {
    export enum JoystickAxis {
        //% block="X"
        X = 0,
        //% block="Y"
        Y = 1
    }
    export enum GamepadButton {
        A = 0,
        B = 1,
        C = 2,
        D = 3,
        E = 4,
        F = 5,
        //% block="Z (joystick press)"
        Z = 6
    }
    export enum GamepadEvent {
        //% block="pressed"
        Pressed = 1,
        //% block="released"
        Released = 2,
        //% block="clicked"
        Clicked = 3
    }
    const GAMEPAD_EVENT_SOURCE = 61036
    let watchedButtons: number[] = []
    let stableButtons: boolean[] = []
    let candidateButtons: boolean[] = []
    let candidateTimes: number[] = []
    let gamepadPolling = false

    /** Raw 0–1023 reading. Calibration, scaling and dead zones belong in your program. */
    //% blockId=stelr_ev_joystick block="joystick %axis raw reading"
    //% group="GamePad" weight=100
    export function joystickRaw(axis: JoystickAxis): number {
        if (axis == JoystickAxis.X) return pins.analogReadPin(AnalogPin.P1)
        return pins.analogReadPin(AnalogPin.P2)
    }

    /** Read a V4.0 button. The external buttons are active low. */
    //% blockId=stelr_ev_button_state block="GamePad button %button is pressed"
    //% group="GamePad" weight=90
    export function gamepadButtonPressed(button: GamepadButton): boolean {
        if (button == GamepadButton.A) return input.buttonIsPressed(Button.A)
        if (button == GamepadButton.B) return input.buttonIsPressed(Button.B)
        let pin = DigitalPin.P8
        if (button == GamepadButton.C) pin = DigitalPin.P13
        else if (button == GamepadButton.D) pin = DigitalPin.P14
        else if (button == GamepadButton.E) pin = DigitalPin.P15
        else if (button == GamepadButton.F) pin = DigitalPin.P16
        pins.setPull(pin, PinPullMode.PullNone)
        return pins.digitalReadPin(pin) == 0
    }

    /** Debounced button event. Clicked means release following a press.
     * A button already held when registered does not generate a pressed event.
     */
    //% blockId=stelr_ev_button_event block="on GamePad button %button %event"
    //% group="GamePad" weight=80
    export function onGamepadButton(button: GamepadButton, event: GamepadEvent, handler: () => void): void {
        control.onEvent(GAMEPAD_EVENT_SOURCE, button * 4 + event, handler)
        if (watchedButtons.indexOf(button) < 0) {
            let pressed = gamepadButtonPressed(button)
            watchedButtons.push(button)
            stableButtons.push(pressed)
            candidateButtons.push(pressed)
            candidateTimes.push(input.runningTime())
        }
        if (gamepadPolling) return
        gamepadPolling = true
        control.inBackground(function () {
            while (true) {
                for (let i = 0; i < watchedButtons.length; i++) {
                    let pressed = gamepadButtonPressed(watchedButtons[i])
                    if (pressed != candidateButtons[i]) {
                        candidateButtons[i] = pressed
                        candidateTimes[i] = input.runningTime()
                    } else if (pressed != stableButtons[i] && input.runningTime() - candidateTimes[i] >= 20) {
                        stableButtons[i] = pressed
                        let event = GamepadEvent.Released
                        if (pressed) event = GamepadEvent.Pressed
                        control.raiseEvent(GAMEPAD_EVENT_SOURCE, watchedButtons[i] * 4 + event)
                        if (!pressed) control.raiseEvent(GAMEPAD_EVENT_SOURCE, watchedButtons[i] * 4 + GamepadEvent.Clicked)
                    }
                }
                basic.pause(10)
            }
        })
    }

    /** V4.0 vibration motor and LED share P12 and cannot be controlled independently. */
    //% blockId=stelr_ev_feedback block="GamePad vibration and LED level %level"
    //% level.min=0 level.max=255 level.defl=0
    //% group="GamePad" weight=70
    export function gamepadFeedback(level: number): void {
        level = Math.max(0, Math.min(255, level))
        pins.analogWritePin(AnalogPin.P12, level * 4)
    }
}
