# Hardware acceptance checklist

Not yet performed on physical hardware. Record the micro:bit revision, board revision, result and date for each test.

1. Confirm DFR0536 V4.0 controller layout and the actual vehicle wiring against README.md. Use separate micro:bits for controller and vehicle.
2. With vehicle wheels raised, run the motor example. Check M1 and stop; adapt the example to check M2–M4, both directions and several speeds. Check servo/stepper functions with suitable connected hardware if they will be taught.
3. On the GamePad, check X/Y at centre and both ends without adding hidden calibration. Check A/B/C/D/E/F/Z states and pressed/released events. Confirm vibration and LED operate together and stop at zero.
4. On the vehicle, power-cycle the complete assembly and run the distance example. Check front and rear independently against measured distances. Cover one sensor at a time to confirm labels. Repeat a cold start several times.
5. Check disconnected/blocked/out-of-range sensors yield invalid readings or initialisation failure rather than a usable obstacle distance. Power-cycle after reconnecting. Record any behaviour that differs from the existing F9 setup.
6. Read P0/P1/P2 across the mat colours and confirm physical left/centre/right mapping. Calibration remains student code.
7. Build each small example in Blocks, download it to a V1 and test it again. Confirm students can edit the blocks. Save the MakeCode project as the teaching starting point.
8. Only then migrate and test the full vehicle/controller programs, checking V1 flash size again. The example headroom does not establish that the complete autonomous program will fit.

MakeCode simulation does not reproduce these external devices. Host tests check software transactions, not electrical behaviour, distance accuracy or motor load performance.
