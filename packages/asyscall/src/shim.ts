import {Asyscall} from '.';

// Here we create on the fly a thread pool to run the
// asynchronous system call function, we use `process.call`
// and `process.frame`.

const asyscall = new Asyscall;
asyscall.build();

process.asyscall = asyscall.exec.bind(asyscall);
process.asyscall64 = asyscall.exec64.bind(asyscall);
