# Bamboo runtime API

*Bamboo* can run on any JavaScript engine, but it requires the JavaScript environment
to provide some APIs in order for Bamboo to run.


## Required

In order for Bamboo to start-up and provide at least basic functionality it requires
all JavaScript runtimes to provide:

  - [`global`](#global)
  - [`process.syscall()`](#process-syscall

### `global`

Bamboo requires that there is a global `global` object in the JavaScript environmet.

### `process.syscall()`

`process.syscall` allows Bamboo to execute system calls, it is basically the only
major dependency required for Bamboo to provide at least the basic implementation
of Node's standard library. The `process.syscall()` function is of the following type:

```ts
type TSyscall = (num: number, arg1?, arg2?, arg3?, arg4?, arg5?, arg6?) => number;
```


## Optional

There are also optional interfaces that JavaScript runtimes can implement to get
greater fidelity and performance from their Bamboo builds.

  - `process.frame()`
  - `process.alloc()`
  - `process.addr()`
  - `process.asyscall()`
  - `Buffer`
  - `StaticBuffer`
