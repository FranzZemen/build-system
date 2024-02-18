/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

export type Task<T,O> = (t?:T) => Promise<O>;
