# Changelog

## 0.1.0 — development build

- Added a single STELR EV toolbox for basic motor, V4 GamePad and dual VL53L0X controls.
- Retained DFRobot motor driver behaviour and corrected its direction block annotation.
- Added raw joystick/button inputs, debounced button events and shared LED/vibration feedback.
- Adapted the existing robot's distance driver; corrected 16-bit register writes to one complete I2C transaction and serialised access to the pair.
- Added four teaching examples and V1/Blocks conversion checks.
- Physical hardware acceptance and complete F11 migration remain outstanding.
