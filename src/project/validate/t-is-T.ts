/*
Created by Franz Zemen 02/19/2024
License Type: MIT
*/

export type tIsT<T> = (t: T | unknown, throwIfNot: boolean) => t is T;
