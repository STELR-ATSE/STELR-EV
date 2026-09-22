// Host-side tests, not micro:bit code. Pass a path to TypeScript's typescript.js.
const fs = require('fs'), vm = require('vm'), assert = require('assert'), path = require('path');
const ts = require(process.argv[2] || 'typescript');
const root = path.join(__dirname, '..');
function environment() {
    const s = { now: 0, digital: {}, analog: { 1: 529, 2: 464 }, writes: [], buffers: [], pointers: {}, handlers: {}, background: [], front: false, rearAddress: 0x29, fail: false, range: 120, buttons: {} };
    const pins = {
        analogReadPin: p => s.analog[p], analogWritePin: (p,v) => s.writes.push(['analog',p,v]),
        digitalReadPin: p => { if(p===12) { s.front=true;return 1; } return s.digital[p]===undefined?1:s.digital[p]; },
        digitalWritePin: (p,v) => {s.writes.push(['digital',p,v]);if(p===12) s.front=!!v;},setPull:()=>{},
        createBuffer: n=>Buffer.alloc(n),
        i2cWriteBuffer: (a,b)=>{s.buffers.push([a,...b]);},
        i2cWriteNumber: (a,v,f)=>{if(f===16){const reg=v>>8,value=v&255;s.writes.push(['i2c',a,reg,value]);if(reg===0x8a&&a===s.rearAddress) s.rearAddress=value;}else{s.pointers[a]=v;}},
        i2cReadNumber: (a,f)=>{const r=s.pointers[a];if(s.fail)return 0;if(f===16)return s.range;if(r===0xc0)return (a===s.rearAddress||(s.front&&a===0x29))?0xee:0;if(r===0x83)return 1;if(r===0x13)return 7;return 0;}
    };
    const c={pins,Buffer,Math:Object.create(Math),hex:(parts)=>Buffer.from(parts[0],'hex'),NumberFormat:{UInt8BE:8,UInt16BE:16},input:{runningTime:()=>s.now,buttonIsPressed:b=>!!s.buttons[b]},Button:{A:0,B:1},basic:{pause:n=>{s.now+=n;if(s.pauseHook)s.pauseHook();}},control:{waitMicros:()=>{},inBackground:f=>s.background.push(f),onEvent:(source,event,f)=>{s.handlers[source+':'+event]=f;},raiseEvent:(source,event)=>{const f=s.handlers[source+':'+event];if(f)f();}}};
    c.Math.idiv=(a,b)=>Math.trunc(a/b);
    c.DigitalPin={};c.AnalogPin={};for(let i=0;i<=20;i++){c.DigitalPin['P'+i]=i;c.AnalogPin['P'+i]=i;}c.PinPullMode={PullNone:0};
    vm.createContext(c);
    for(const file of ['motors.ts','gamepad.ts','distance.ts']) vm.runInContext(ts.transpile(fs.readFileSync(path.join(root,file),'utf8'),{target:ts.ScriptTarget.ES2018}),c);
    return {s,c,api:c.stelrEV};
}
{
    const {s,api}=environment();assert.equal(s.writes.length,0);assert.equal(s.background.length,0);
    assert.equal(api.joystickRaw(0),529);assert.equal(api.joystickRaw(1),464);
    for(const [b,p] of [[2,13],[3,14],[4,15],[5,16],[6,8]]){s.digital[p]=0;assert.equal(api.gamepadButtonPressed(b),true);s.digital[p]=1;assert.equal(api.gamepadButtonPressed(b),false);}
    s.buttons[0]=true;assert.equal(api.gamepadButtonPressed(0),true);
    api.gamepadFeedback(-2);api.gamepadFeedback(100);api.gamepadFeedback(300);
    assert.deepEqual(s.writes,[['analog',12,0],['analog',12,400],['analog',12,1020]]);
    console.log('PASS GamePad V4 pin mapping, raw joystick, feedback limits and lazy startup');
}
{
    const {s,api}=environment();const events=[];
    for(const e of [1,2,3])api.onGamepadButton(2,e,()=>events.push(e));
    assert.equal(s.background.length,1);
    s.pauseHook=()=>{s.digital[13]=(s.now>=30&&s.now<80)?0:1;if(s.now>=130)throw 'done';};
    try{s.background[0]();}catch(e){assert.equal(e,'done');}
    assert.deepEqual(events,[1,2,3]);console.log('PASS debounced pressed, released and clicked events; single polling loop');
}
{
    const {s,api}=environment();assert.equal(api.readDistance(0),-1);assert.equal(api.distanceReadingValid(0),false);
    api.initialiseDistanceSensors();assert.equal(api.distanceSensorsReady(),true);
    assert.equal(s.rearAddress,0x30);assert.equal(s.front,true);
    assert(s.buffers.some(b=>JSON.stringify(b)===JSON.stringify([0x29,0x44,0,32])));
    const setupWrites=s.writes.length;api.initialiseDistanceSensors();assert.equal(s.writes.length,setupWrites);
    assert.equal(api.readDistance(0),120);assert.equal(api.distanceReadingValid(0),true);
    s.range=345;assert.equal(api.readDistance(1),345);assert.equal(api.distanceReadingValid(1),true);
    s.range=8190;assert.equal(api.readDistance(0),-1);assert.equal(api.distanceReadingValid(0),false);
    assert.equal(api.distanceReadingValid(1),true);
    s.fail=true;assert.equal(api.readDistance(1),-1);assert.equal(api.distanceReadingValid(1),false);
    console.log('PASS dual-ToF setup/addressing, atomic 16-bit write, repeat initialisation, readings, invalid result and timeout');
}
{
    const {s,api}=environment();s.fail=true;api.initialiseDistanceSensors();assert.equal(api.distanceSensorsReady(),false);assert.equal(api.readDistance(0),-1);
    console.log('PASS missing-sensor setup fails without reporting a valid distance');
}
{
    const {s,api}=environment();
    for(const motor of [1,2,3,4])for(const direction of [-1,1])for(const speed of [0,1,80,255]){
        api.MotorRun(motor,direction,speed);
        const positive=(4-motor)*2+1,negative=(4-motor)*2;
        const pwm=speed*16;
        const expectedPositive=direction>0?pwm:0,expectedNegative=direction<0?pwm:0;
        assert.deepEqual(s.buffers.slice(-2),[[0x40,6+positive*4,0,0,expectedPositive&255,expectedPositive>>8],[0x40,6+negative*4,0,0,expectedNegative&255,expectedNegative>>8]]);
    }
    api.motorStopAll();assert(s.buffers.slice(-8).every(b=>b.slice(2).every(v=>v===0)));
    console.log('PASS motor M1–M4 channel mapping, both directions, speed limits and stop all');
}
console.log('Hardware emulation tests passed. Physical hardware validation is still required.');
