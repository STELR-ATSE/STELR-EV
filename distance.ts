// VL53L0X hardware driver derived from the user's working F9 program.
// Preserves calibration/tuning and the front-XSHUT P12 wiring.
namespace stelrEV {
    export enum DistanceSensor {
        //% block="front"
        Front = 0,
        //% block="rear"
        Rear = 1
    }
    let ToFInitialised = false
    let FrontDistanceValid = false
    let RearDistanceValid = false
    let distanceBusy = false
    let distanceInitAttempted = false
const FRONT_XSHUT_PIN = DigitalPin.P12
const VL53_DEFAULT_ADDRESS = 0x29
const FRONT_TOF_ADDRESS = 0x29
const REAR_TOF_ADDRESS = 0x30
//  ============================================================
//  VL53L0X REGISTERS
//  ============================================================
const SYSRANGE_START = 0x00
const SYSTEM_SEQUENCE_CONFIG = 0x01
const SYSTEM_INTERRUPT_CONFIG_GPIO = 0x0A
const SYSTEM_INTERRUPT_CLEAR = 0x0B
const RESULT_INTERRUPT_STATUS = 0x13
const RESULT_RANGE_STATUS = 0x14
const MSRC_CONFIG_CONTROL = 0x60
const FINAL_RANGE_CONFIG_MIN_COUNT_RATE_RTN_LIMIT = 0x44
const GLOBAL_CONFIG_SPAD_ENABLES_REF_0 = 0xB0
const GLOBAL_CONFIG_REF_EN_START_SELECT = 0xB6
const DYNAMIC_SPAD_NUM_REQUESTED_REF_SPAD = 0x4E
const DYNAMIC_SPAD_REF_EN_START_OFFSET = 0x4F
const VHV_CONFIG_PAD_SCL_SDA_EXTSUP_HV = 0x89
const GPIO_HV_MUX_ACTIVE_HIGH = 0x84
const I2C_SLAVE_DEVICE_ADDRESS = 0x8A
const VL53_IO_TIMEOUT = 300
//  ============================================================
//  VL53L0X VARIABLES
//  ============================================================
let ToFCurrentAddress = VL53_DEFAULT_ADDRESS
let ToFStopVariable = 0
let FrontStopVariable = 0
let RearStopVariable = 0
let ToFSpadCount = 0
let ToFSpadIsAperture = false
let Spad0 = 0
let Spad1 = 0
let Spad2 = 0
let Spad3 = 0
let Spad4 = 0
let Spad5 = 0
let FrontToFReady = false
let RearToFReady = false

function tof_write_reg(register: number, value: number) {
    pins.i2cWriteNumber(ToFCurrentAddress, register * 256 + value, NumberFormat.UInt16BE, false)
}

function tof_read_reg(register: number): number {
    pins.i2cWriteNumber(ToFCurrentAddress, register, NumberFormat.UInt8BE, false)
    return pins.i2cReadNumber(ToFCurrentAddress, NumberFormat.UInt8BE, false)
}

function tof_write_reg16(register: number, value: number) {
    let data = pins.createBuffer(3)
    data[0] = register
    data[1] = value >> 8
    data[2] = value & 255
    pins.i2cWriteBuffer(ToFCurrentAddress, data)
}

function tof_read_reg16(register: number): number {
    pins.i2cWriteNumber(ToFCurrentAddress, register, NumberFormat.UInt8BE, false)
    return pins.i2cReadNumber(ToFCurrentAddress, NumberFormat.UInt16BE, false)
}

function get_spad_byte(index: number): number {
    if (index == 0) {
        return Spad0
    }
    
    if (index == 1) {
        return Spad1
    }
    
    if (index == 2) {
        return Spad2
    }
    
    if (index == 3) {
        return Spad3
    }
    
    if (index == 4) {
        return Spad4
    }
    
    return Spad5
}

function set_spad_byte(index: number, value: number) {
    
    
    
    
    
    
    if (index == 0) {
        Spad0 = value
    } else if (index == 1) {
        Spad1 = value
    } else if (index == 2) {
        Spad2 = value
    } else if (index == 3) {
        Spad3 = value
    } else if (index == 4) {
        Spad4 = value
    } else {
        Spad5 = value
    }
    
}

function tof_read_spads() {
    
    
    
    
    
    
    Spad0 = tof_read_reg(0xB0)
    Spad1 = tof_read_reg(0xB1)
    Spad2 = tof_read_reg(0xB2)
    Spad3 = tof_read_reg(0xB3)
    Spad4 = tof_read_reg(0xB4)
    Spad5 = tof_read_reg(0xB5)
}

function tof_write_spads() {
    tof_write_reg(0xB0, Spad0)
    tof_write_reg(0xB1, Spad1)
    tof_write_reg(0xB2, Spad2)
    tof_write_reg(0xB3, Spad3)
    tof_write_reg(0xB4, Spad4)
    tof_write_reg(0xB5, Spad5)
}

function tof_get_spad_info(): boolean {
    
    
    tof_write_reg(0x80, 0x01)
    tof_write_reg(0xFF, 0x01)
    tof_write_reg(0x00, 0x00)
    tof_write_reg(0xFF, 0x06)
    let value83 = tof_read_reg(0x83)
    tof_write_reg(0x83, value83 | 0x04)
    tof_write_reg(0xFF, 0x07)
    tof_write_reg(0x81, 0x01)
    tof_write_reg(0x80, 0x01)
    tof_write_reg(0x94, 0x6B)
    tof_write_reg(0x83, 0x00)
    let timeout = 0
    while (tof_read_reg(0x83) == 0) {
        timeout += 1
        basic.pause(1)
        if (timeout >= VL53_IO_TIMEOUT) {
            return false
        }
        
    }
    tof_write_reg(0x83, 0x01)
    let value = tof_read_reg(0x92)
    tof_write_reg(0x81, 0x00)
    tof_write_reg(0xFF, 0x06)
    value83 = tof_read_reg(0x83)
    tof_write_reg(0x83, value83 & 0xFB)
    tof_write_reg(0xFF, 0x01)
    tof_write_reg(0x00, 0x01)
    tof_write_reg(0xFF, 0x00)
    tof_write_reg(0x80, 0x00)
    ToFSpadCount = value & 0x7F
    ToFSpadIsAperture = (value & 0x80) != 0
    return true
}

function tof_configure_spads() {
    let first_spad: number;
    let byte_index: number;
    let bit_index: number;
    let bit_mask: number;
    let current_byte: number;
    tof_read_spads()
    if (ToFSpadIsAperture) {
        first_spad = 12
    } else {
        first_spad = 0
    }
    
    let enabled_spads = 0
    for (let i = 0; i < 48; i++) {
        byte_index = Math.idiv(i, 8)
        bit_index = i % 8
        bit_mask = 1 << bit_index
        current_byte = get_spad_byte(byte_index)
        if (i < first_spad || enabled_spads >= ToFSpadCount) {
            current_byte = current_byte & 255 - bit_mask
            set_spad_byte(byte_index, current_byte)
        } else if ((current_byte & bit_mask) != 0) {
            enabled_spads += 1
        }
        
    }
    tof_write_spads()
}

function tof_reference_calibration(value: number): boolean {
    tof_write_reg(SYSRANGE_START, 0x01 | value)
    let timeout = 0
    while ((tof_read_reg(RESULT_INTERRUPT_STATUS) & 0x07) == 0) {
        timeout += 1
        basic.pause(1)
        if (timeout >= VL53_IO_TIMEOUT) {
            return false
        }
        
    }
    tof_write_reg(SYSTEM_INTERRUPT_CLEAR, 0x01)
    tof_write_reg(SYSRANGE_START, 0x00)
    return true
}

function tof_apply_tuning() {
    //  Immutable MakeCode byte buffer: all 80 F9 register/value pairs,
    //  in their original order, including every register-page selection.
    //  This compact table belongs to the hardware driver, not student logic.
    let tuning = hex`ff010000ff00090010001100240125ff7500ff014e2c48003020ff003009540031043203408346256000270050065100529656085730610062006400650066a0ff012232471449ff4a00ff007a0a7b007821ff012334420044ff4526460540400e06201a4340ff0034033544ff0131044b094c054d04ff00440045204708482867007004710172fe76007700ff010d01ff00800101f8ff018e010001ff008000`
    for (let index = 0; index < 80; index++) {
        tof_write_reg(tuning[index * 2], tuning[index * 2 + 1])
    }
}

function tof_init_current(): boolean {
    
    if (tof_read_reg(0xC0) != 0xEE) {
        return false
    }
    
    let value = tof_read_reg(VHV_CONFIG_PAD_SCL_SDA_EXTSUP_HV)
    tof_write_reg(VHV_CONFIG_PAD_SCL_SDA_EXTSUP_HV, value | 0x01)
    tof_write_reg(0x88, 0x00)
    tof_write_reg(0x80, 0x01)
    tof_write_reg(0xFF, 0x01)
    tof_write_reg(0x00, 0x00)
    ToFStopVariable = tof_read_reg(0x91)
    tof_write_reg(0x00, 0x01)
    tof_write_reg(0xFF, 0x00)
    tof_write_reg(0x80, 0x00)
    value = tof_read_reg(MSRC_CONFIG_CONTROL)
    tof_write_reg(MSRC_CONFIG_CONTROL, value | 0x12)
    tof_write_reg16(FINAL_RANGE_CONFIG_MIN_COUNT_RATE_RTN_LIMIT, 32)
    tof_write_reg(SYSTEM_SEQUENCE_CONFIG, 0xFF)
    if (!tof_get_spad_info()) {
        return false
    }
    
    tof_write_reg(0xFF, 0x01)
    tof_write_reg(DYNAMIC_SPAD_REF_EN_START_OFFSET, 0x00)
    tof_write_reg(DYNAMIC_SPAD_NUM_REQUESTED_REF_SPAD, 0x2C)
    tof_write_reg(0xFF, 0x00)
    tof_write_reg(GLOBAL_CONFIG_REF_EN_START_SELECT, 0xB4)
    tof_configure_spads()
    tof_apply_tuning()
    tof_write_reg(SYSTEM_INTERRUPT_CONFIG_GPIO, 0x04)
    value = tof_read_reg(GPIO_HV_MUX_ACTIVE_HIGH)
    tof_write_reg(GPIO_HV_MUX_ACTIVE_HIGH, value & 0xEF)
    tof_write_reg(SYSTEM_INTERRUPT_CLEAR, 0x01)
    tof_write_reg(SYSTEM_SEQUENCE_CONFIG, 0x01)
    if (!tof_reference_calibration(0x40)) {
        return false
    }
    
    tof_write_reg(SYSTEM_SEQUENCE_CONFIG, 0x02)
    if (!tof_reference_calibration(0x00)) {
        return false
    }
    
    tof_write_reg(SYSTEM_SEQUENCE_CONFIG, 0xE8)
    return true
}

function tof_change_address(new_address: number) {
    
    tof_write_reg(I2C_SLAVE_DEVICE_ADDRESS, new_address)
    ToFCurrentAddress = new_address
}

function tof_distance(address: number, stop_variable: number): number {
    
    ToFCurrentAddress = address
    tof_write_reg(0x80, 0x01)
    tof_write_reg(0xFF, 0x01)
    tof_write_reg(0x00, 0x00)
    tof_write_reg(0x91, stop_variable)
    tof_write_reg(0x00, 0x01)
    tof_write_reg(0xFF, 0x00)
    tof_write_reg(0x80, 0x00)
    tof_write_reg(SYSRANGE_START, 0x01)
    let timeout = 0
    while ((tof_read_reg(SYSRANGE_START) & 0x01) != 0) {
        timeout += 1
        basic.pause(1)
        if (timeout >= VL53_IO_TIMEOUT) {
            return -1
        }
        
    }
    timeout = 0
    while ((tof_read_reg(RESULT_INTERRUPT_STATUS) & 0x07) == 0) {
        timeout += 1
        basic.pause(1)
        if (timeout >= VL53_IO_TIMEOUT) {
            return -1
        }
        
    }
    let distance = tof_read_reg16(RESULT_RANGE_STATUS + 10)
    tof_write_reg(SYSTEM_INTERRUPT_CLEAR, 0x01)
    if (distance <= 0 || distance >= 8190) {
        return -1
    }
    
    return distance
}

function initialise_tof_sensors(): boolean {
    
    
    
    
    
    
    
    
    FrontToFReady = false
    RearToFReady = false
    FrontDistanceValid = false
    RearDistanceValid = false
    //  Hold front sensor in shutdown.
    pins.digitalWritePin(FRONT_XSHUT_PIN, 0)
    basic.pause(50)
    //  Rear remains at 0x29.
    ToFCurrentAddress = VL53_DEFAULT_ADDRESS
    if (!tof_init_current()) {
        return false
    }
    
    RearStopVariable = ToFStopVariable
    //  Move rear to 0x30.
    tof_change_address(REAR_TOF_ADDRESS)
    basic.pause(20)
    ToFCurrentAddress = REAR_TOF_ADDRESS
    if (tof_read_reg(0xC0) != 0xEE) {
        return false
    }
    
    RearToFReady = true
    //  Release front XSHUT.
    //  Do NOT actively drive it high.
    pins.setPull(FRONT_XSHUT_PIN, PinPullMode.PullNone)
    pins.digitalReadPin(FRONT_XSHUT_PIN)
    basic.pause(100)
    //  Front wakes at 0x29.
    ToFCurrentAddress = FRONT_TOF_ADDRESS
    if (!tof_init_current()) {
        RearToFReady = false
        return false
    }
    
    FrontStopVariable = ToFStopVariable
    FrontToFReady = true
    ToFInitialised = true
    basic.pause(20)

    return true
}

    /** Initialise the two GY-530 VL53L0X sensors. Front XSHUT must be wired to P12.
     * Call once after power-up. A failed setup requires a sensor power cycle.
     */
    //% blockId=stelr_ev_distance_init block="initialise distance sensors"
    //% group="Distance Sensors" weight=90
    export function initialiseDistanceSensors(): void {
        while (distanceBusy) basic.pause(1)
        if (distanceInitAttempted) return
        distanceBusy = true
        distanceInitAttempted = true
        ToFInitialised = initialise_tof_sensors()
        distanceBusy = false
    }

    /** True only after both sensors have initialised successfully. */
    //% blockId=stelr_ev_distance_ready block="distance sensors ready"
    //% group="Distance Sensors" weight=80
    export function distanceSensorsReady(): boolean {
        return ToFInitialised
    }

    /** Take a fresh measurement. Returns -1 if not ready or if measurement fails.
     * This block waits for the selected sensor; it does not drive the robot.
     */
    //% blockId=stelr_ev_distance_read block="read %sensor distance (mm)"
    //% group="Distance Sensors" weight=70
    export function readDistance(sensor: DistanceSensor): number {
        while (distanceBusy) basic.pause(1)
        distanceBusy = true
        let value = -1
        if (ToFInitialised) {
            if (sensor == DistanceSensor.Front) value = tof_distance(FRONT_TOF_ADDRESS, FrontStopVariable)
            else value = tof_distance(REAR_TOF_ADDRESS, RearStopVariable)
        }
        if (sensor == DistanceSensor.Front) FrontDistanceValid = value >= 0
        else RearDistanceValid = value >= 0
        distanceBusy = false
        return value
    }

    /** Whether the last read of this sensor succeeded. False before the first read. */
    //% blockId=stelr_ev_distance_valid block="last %sensor distance reading valid"
    //% group="Distance Sensors" weight=60
    export function distanceReadingValid(sensor: DistanceSensor): boolean {
        if (sensor == DistanceSensor.Front) return FrontDistanceValid
        return RearDistanceValid
    }
}
