import {Buffer} from './buffer';

export class StaticBuffer extends Buffer {
    call(offset?: number, args?: number[]);
    getAddress(offset?: number): number64;
    slice(start?: number, end?: number): StaticBuffer;
    free();

    _next: StaticBuffer; // Secret property used in asynchronous syscall thread pool
    print(); // Available only while debugging.
}


export interface IStaticBuffer {
    new (size: number): StaticBuffer;
    new (array: number[]): StaticBuffer;
    alloc(size: number|number[], prot: string): StaticBuffer;
    frame(addr: Taddress, size: number): StaticBuffer;
    isStaticBuffer(value: any): boolean;
}

export declare var StaticBuffer: IStaticBuffer;
