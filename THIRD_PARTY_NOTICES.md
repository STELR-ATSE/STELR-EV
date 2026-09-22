# Source and modification notices

## DFRobot motor driver

Source: https://github.com/DFRobot/pxt-motor
Revision: 2cdf17586556c5a532782aa436c516ae50f5f316

motors.ts incorporates the DFRobot driver and retains its copyright and GNU Lesser General Public License notice. Changes for STELR EV: namespace, category/group metadata, prefixed block IDs and a direction-parameter annotation correction. Driver behaviour is otherwise retained. The upstream header does not specify an LGPL version; this combined distribution uses LGPL-3.0-or-later. The user has also confirmed permission from DFRobot to use its software.

## GamePad

Reference: https://github.com/DFRobot/pxt-gamePad
Reference revision: b509667f2d9acf19327c1c50e89b2c764d0dbb78
V4 hardware documentation: https://wiki.dfrobot.com/dfr0536/

gamepad.ts is a new TypeScript implementation for the V4.0 layout used by the supplied controller program. It does not copy the older GamePad native shim. Joystick analogue reads and button F differ from the older extension. Vibration and LED share P12.

## Distance sensor driver

distance.ts adapts the VL53L0X register initialisation and ranging logic supplied in the user's STELR robot code. The existing tuning sequence and front-XSHUT arrangement are retained. Register-level routines are implementation details, not student blocks.

The 16-bit register-write helper has intentionally been corrected to send the register address and both data bytes together in one I2C transaction. Pair initialisation, serialised access and validity reporting are exposed as basic hardware functions. Vehicle obstacle thresholds and navigation decisions are excluded. Physical validation remains required.

## MakeCode

Compiled and conversion-tested using Microsoft's MakeCode micro:bit target and compiler. These development tools are not bundled in this ZIP.
