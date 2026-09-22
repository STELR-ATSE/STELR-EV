# Development validation — 22 September 2026

Target: pxt-microbit 9.1.1, pxt-core 13.0.1, pxt-common-packages 14.0.2; native micro:bit V1/mbdal compilation. Available program flash in this build: 242,688 bytes. Runtime contribution: 216,064 bytes.

| Program | Total flash bytes | Free bytes |
| --- | ---: | ---: |
| Motor example | 220,336 | 22,352 |
| GamePad example | 220,276 | 22,412 |
| Distance example | 223,420 | 19,268 |
| Standard analogue example | 218,888 | 23,800 |
| Combined API coverage | 230,380 | 12,308 |

All five compile successfully. Each TypeScript program decompiles to Blocks with grey blocks treated as errors. Each also converts to Python, compiles from Python and decompiles back to Blocks without grey blocks. This is compiler/converter validation; an interactive Blockly edit-and-recompile test has not been performed.

The compiler removes unused functions, so small projects do not include every driver function. These figures are for the listed programs, not the full autonomous robot or controller. Future editor versions and additional student code can change the results.

Host emulation tests pass for: no hardware writes or background activity merely from loading the extension; GamePad pin mapping/raw readings/feedback limits and button debounce events; dual sensor initialisation/addressing, complete 16-bit I2C writes, reading validity and timeouts; all four motor channel mappings, direction, speed samples and stop-all. These do not establish physical sensor accuracy, hardware compatibility under load or electrical reliability. V2 hardware has not been tested.

For maintainers, tests/hardware.js runs under Node with a TypeScript compiler path as its first argument: node tests/hardware.js /path/to/typescript.js. Native compilation requires the matching MakeCode target toolchain. The recorded machine-readable compiler results are in validation-results.json.

Outstanding: actual hardware checklist, interactive Blocks testing and full F9/F11 program migration with its own V1 size check.
