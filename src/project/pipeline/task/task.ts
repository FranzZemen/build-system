/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {Log} from "../../log/index.js";


export type Task<T,O> = (log: Log, rollbackSteps: string[], t:T) => Promise<O>;
export type EncapsulatedTask = Task<void,void>;
