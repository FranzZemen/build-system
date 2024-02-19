// fastest-getValidator does not export Validator properly when compbined with ESM + nodenext moduleResolution per
// typescript issues read.  However, the error is really one of typescript religiousness, because code *would* run.
// Not likely that either fastest-getValidator (or the many src that have this problem with default exports
// will be solving for it soon, neither will typescript.  This handy workaround works, though.

import {ValidatorConstructorOptions} from 'fastest-validator';
import Validator from 'fastest-validator';
const defaultOptions: ValidatorConstructorOptions = {useNewCustomCheckerFunction: true};

const validator = new Validator(defaultOptions);

export function getValidator(options?: ValidatorConstructorOptions) {
  if(options) {
    return new Validator(options);
  }
  return validator;
}
