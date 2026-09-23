# Source and modification notices

## DFRobot clarification recorded 24 September 2026

DFRobot's response, supplied by Graham Stock in the conversation “Save DFRobot licensing context”, confirms that pxt-motor and pxt-gamePad are LGPL codebases and that no separate commercial licence is required when used under those terms. The reply does not name an LGPL version and does not grant permission to relicense the incorporated code under MIT. The package's existing LGPL-3.0-or-later designation must not be represented as a version explicitly confirmed by this reply.

Retain original copyright/licence notices, include the LGPL text, identify modifications and their dates, and make the complete corresponding source for integrated components available. Newly developed code may have a different licence, but existing DFRobot notices and applicable LGPL terms must remain. This package currently keeps its existing LGPL designation; no licence change is made by this documentation update.

STELR EV is an independently maintained STELR extension. It is not an official DFRobot extension, partnership product or DFRobot-certified product. Product names identify hardware compatibility only; DFRobot branding is not used as STELR EV's identity. DFRobot supplies its code as is and does not assume responsibility for third-party modifications.

DFRobot also reported no I2C address conflicts for the integration it reviewed. The two VL53L0X sensors still need the existing XSHUT/address-assignment sequence because both start at 0x29.

The source is distributed in this package and at https://github.com/STELR-ATSE/STELR-EV. The incorporated motor source is motors.ts; upstream provenance is listed below. Keep corresponding source available for each released version.

## DFRobot motor driver

Source: https://github.com/DFRobot/pxt-motor
Revision: 2cdf17586556c5a532782aa436c516ae50f5f316

motors.ts incorporates the DFRobot driver and retains its copyright and GNU Lesser General Public License notice. Modifications made 22 September 2026: namespace, category/group metadata, prefixed block IDs and a direction-parameter annotation correction. Driver behaviour is otherwise retained. The upstream header does not specify an LGPL version; this combined distribution currently declares LGPL-3.0-or-later. The dated source notice was added 24 September 2026.

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
