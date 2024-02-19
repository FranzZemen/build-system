/*
Created by Franz Zemen 02/18/2024
License Type: 
*/

import {
  AsyncCheckFunction,
  SyncCheckFunction,
  ValidationError,
  ValidationSchema,
  ValidatorConstructorOptions
} from "fastest-validator";
import {Log} from "../log/index.js";
import {inspect} from "node:util";
import {getValidator} from "./get-validator.cjs";
import {BuildError} from "../util/index.js";

export type ValidatedTypeName = 'unknown' | 'package' | 'build-config';

function checkFunctionIsSync(checkFunction: SyncCheckFunction | AsyncCheckFunction): checkFunction is SyncCheckFunction {
  return checkFunction.async === false;
}

export function compileSync(schema: ValidationSchema, validatorOptions?: ValidatorConstructorOptions): SyncCheckFunction {
  const validator = getValidator(validatorOptions);

  const checkFunction = validator.compile(schema);
  if(checkFunctionIsSync(checkFunction)) {
    return checkFunction;
  } else {
    const log: Log = new Log();
    const errorMsg ='Schema does not compile to SyncCheckFunction (async)';
    log.error(errorMsg);
    log.warn(inspect(schema,false,10,true));
    throw new BuildError(errorMsg);
  }
}

export function validate<T>(t: T | unknown, checkFunction: SyncCheckFunction, validatedTypeName: ValidatedTypeName = 'unknown'): boolean {
  const result: true | ValidationError[] = checkFunction(t);
  if(result === true) {
    return true;
  } else {
    const log: Log = new Log();
    const name = t
    const errorMsg = `Validation failure for object type ${validatedTypeName}`;
    log.error(errorMsg);
    log.warn(inspect(result,false,10,true));
    throw new BuildError(errorMsg);
  }
}
