/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {deepCopy} from '../../util/deep-copy.js';
import {Transform} from './transform.js';


export type TransformInConstructor<CLASS extends TransformIn<PIPE_IN>, PIPE_IN> = new (logDepth: number) => CLASS;


/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipelines payload (piped in):    true
 * Derived classes consume passed in payload (passed in):  false
 * Derived classes produce pipelines data (piped out):      false
 * Pipeline data is altered:                               false
 * Pipeline out is = Pipeline In
 *
 * The pipelines data out (piped out) is simply what was piped in.  Thus pipelines data is not impacted.
 * piped in data.
 *
 * If paylo@ad is passed in, it is ignored.
 */
export abstract class TransformIn<PIPED_IN> extends Transform<undefined, PIPED_IN, PIPED_IN> {

  protected constructor(depth: number) {
    super(depth);
  }

  public override async execute(rollbackSteps: string[], pipeIn: PIPED_IN, passedIn = undefined): Promise<PIPED_IN> {
    return super.execute(rollbackSteps, pipeIn, undefined);
  }

  protected executeImpl(rollbackSteps: string[], pipeIn: PIPED_IN, passedIn: undefined): Promise<PIPED_IN> {
    const pipedInCopy = deepCopy(pipeIn)
    return this.executeImplIn(rollbackSteps, pipedInCopy)
      .then(()=>pipeIn);
  }

  protected abstract executeImplIn(rollbackSteps: string[], pipedIn: PIPED_IN): Promise<void>;
}
