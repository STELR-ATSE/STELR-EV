# STELR EV

Development version 0.1.0 for the STELR education program, Australian Academy of Technological Sciences and Engineering (ATSE).

One MakeCode extension containing basic hardware controls for the DFRobot motor expansion board, DFR0536 V4.0 GamePad and two GY-530 VL53L0X distance sensors. It depends only on MakeCode core; the separate DFRobot extensions are not required.

## Teaching scope

The STELR EV toolbox contains Motors, GamePad and Distance Sensors groups. Students build calibration, joystick scaling, radio communication, motor combinations, colour classification, line following, marker turns and obstacle decisions themselves using standard blocks. No Fast/Slow robot behaviour is included. Read the line array with standard analogue input blocks.

This is a first development build, not a hardware-qualified school release. The supplied examples compile for micro:bit V1 and convert to Blocks without grey blocks, including conversion from generated Python. The full F9/F11 vehicle program has not been converted or validated against this extension.

## Hardware blocks

| Group | Functions |
| --- | --- |
| Motors | Run/stop individual M1–M4 motors; stop all; servo S1–S8; inherited 28/42 stepper degree/turn controls, including dual control |
| GamePad | Raw X/Y joystick readings (0–1023); button state; pressed/released/clicked events; combined vibration and LED level (0–255) |
| Distance Sensors | Initialise the pair; check initialisation; read front/rear distance in millimetres; check validity of the last reading |

Motor speed is 0–255. Directions describe electrical direction; students determine which direction moves their assembled vehicle forward. Servo and stepper behaviour follows the original DFRobot driver.

GamePad events are debounced. Clicked is emitted on release; a button already held when an event is registered does not generate an initial pressed event. Raw button reads are not debounced. The event poller starts only when an event is registered.

Distance reads wait for a fresh measurement and return -1 on failure. Check validity after each read before using the number. Validity is false before a first successful reading. It is a basic timeout/range check, not a complete sensor diagnostic. Initialisation runs once per power cycle: subsequent calls do not reset a working pair. If it fails, check wiring and power-cycle both sensors and the micro:bit.

## Kit connections

The controller and vehicle use separate micro:bits. Do not combine their pin assignments on one board.

| Device | Connections used |
| --- | --- |
| Motor board | I2C, address 0x40; standard micro:bit P19 SCL / P20 SDA |
| Front VL53L0X | Shared I2C; XSHUT P12; operating address 0x29 |
| Rear VL53L0X | Shared I2C; kept enabled; reassigned to 0x30 at startup |
| Three connected line-array outputs | P0/P1/P2, as in the existing vehicle program; verify physical left/centre/right orientation |
| GamePad V4 joystick | X P1, Y P2, press Z P8 |
| GamePad V4 external buttons | C P13, D P14, E P15, F P16; active low |
| GamePad feedback | P12 controls vibration and LED together |

The older pxt-gamePad extension uses a different board layout. This extension targets V4.0. Independent LED and vibration control is not available on its shared P12 connection. A buzzer helper is not included; board revisions vary.

## Examples

Install the extension in a separate MakeCode project, open JavaScript and paste one example .ts file, then switch to Blocks. Matching .py and .blocks files are included as references. Use one example at a time on the indicated device.

- 01-motor: vehicle, wheels raised; A briefly runs M1, B stops all.
- 02-gamepad: controller; A/B show joystick readings, C holds feedback on.
- 03-distance: vehicle; initialise, then A reads front and B reads rear.
- 04-line-inputs: vehicle; send P0/P1/P2 readings to serial using standard blocks.

The root test.ts is compiler coverage, not a demonstration to flash: it mixes controller and vehicle functions and can drive multiple outputs. It is excluded when the extension is used as a dependency.

See [upload instructions](UPLOAD_GUIDE.md), [validation results](docs/VALIDATION.md), [hardware checklist](docs/HARDWARE_CHECKLIST.md) and [source notices](THIRD_PARTY_NOTICES.md).

## Licence

This independently maintained STELR extension includes adapted pxt-motor code from DFRobot, retaining DFRobot's copyright and LGPL notice. GamePad V4 support is a new TypeScript implementation based on the documented hardware layout; the older pxt-gamePad native shim is not incorporated. Compatible product names identify hardware support, not DFRobot endorsement or certification. See THIRD_PARTY_NOTICES.md for DFRobot's clarification recorded on 24 September 2026, dated modifications and source availability.

Distributed under LGPL-3.0-or-later. DFRobot notices are retained. See LICENSE.txt and its companion COPYING.txt. MakeCode gallery approval has not been requested or established.
