# JavaScript runtimes

*Bamboo* can run on any JavaScript engine, but it needs the engines to implement
[*Bamboo runtime API*](./runtime-api.md) in order for Bamboo to be able to run on them.

Bamboo already can run on Node.js, Duktape and V8; below is a list of supported 
JavaScript engines: 

 - [X] Node.js
 - [ ] Browsers - need to implement UNIX *"shim"*.
 
JIT compiling runtimes:

 - [X] V8
 - [ ] Carakan
 - [ ] Chakra -- currently Chakra runs only on Windows
 - [ ] SpiderMonkey
 - [ ] JavaScriptCore
 - [ ] Nashorn
    - [ ] HotSpot
    - [ ] OpenJDK

Interpreter runtimes:

 - [X] Duktape
 - [ ] Continuum
 - [ ] Futhark
 - [ ] InScript
 - [ ] JScript
 - [ ] KJS
 - [ ] Linear B
 - [ ] Narcissus
 - [ ] JS-Interpreter
 - [ ] Rhino
    - [ ] HotSpot
    - [ ] OpenJDK
 - [ ] YAJI
 - [ ] Jsish
 - [ ] Websocket.js
 - [ ] Espruino
 - [ ] MuJS
 - [ ] V7
 - [ ] Tiny-JS
 - [ ] JerryScript
