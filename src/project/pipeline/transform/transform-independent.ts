/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';

export type TransformIndependentConstructor<CLASS extends TransformIndependent<PIPED_IN>, PIPED_IN> = new (logDepth: number) => CLASS;


/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipelines payload (piped in):    false
 * Derived classes consume passed in payload (passed in):  false
 * Derived classes produce pipelines data (piped out):      false
 * Pipeline data is altered:                               false
 * Pipeline out = Pipeline in
 */
export abstract class TransformIndependent<PIPED_IN = any> extends Transform<undefined, PIPED_IN, PIPED_IN> {
  protected constructor(depth: number) {
    super(depth);
  }

  public override async execute(rollbackSteps: string[], pipeIn: PIPED_IN, passedIn = undefined): Promise<PIPED_IN> {
    return super.execute(rollbackSteps, pipeIn, undefined)
                .then(output => {return pipeIn;});
  }

  protected executeImpl(rollbackSteps: string[], pipeIn: PIPED_IN, passedIn: undefined): Promise<PIPED_IN> {
    return this.executeImplIndependent(rollbackSteps)
               .then(() => pipeIn);
  }

  protected abstract executeImplIndependent(rollbackSteps: string[]): Promise<void>;
}
