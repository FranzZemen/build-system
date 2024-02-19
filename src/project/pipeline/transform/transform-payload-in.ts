/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {deepCopy} from '../../util/deep-copy.js';
import {Transform} from './transform.js';

export type TransformPayloadInConstructor<CLASS extends TransformPayloadIn<PASSED_IN, PIPE_IN>, PASSED_IN, PIPE_IN> = new (logDepth: number) => CLASS;

/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipelines payload (piped in):    true
 * Derived classes consume passed in payload (passed in):  true
 * Derived classes produce pipelines data (piped out):      false
 * Pipeline data is altered:                               false
 * Pipeline out = Pipeline in
 */
export abstract class TransformPayloadIn<PASSED_IN, PIPE_IN> extends Transform<PASSED_IN, PIPE_IN, PIPE_IN> {
  protected constructor(depth: number) {
    super(depth);
  }

  public override async execute(rollbackSteps: string[], pipeIn: PIPE_IN, passedIn?: PASSED_IN): Promise<PIPE_IN> {
    return super.execute(rollbackSteps, pipeIn, passedIn);
  }

  protected executeImpl(rollbackSteps: string[], pipeIn: PIPE_IN, passedIn: PASSED_IN): Promise<PIPE_IN> {

    const pipedInCopy = deepCopy(pipeIn);
    return this.executeImplPayloadIn(rollbackSteps, pipedInCopy, passedIn)
      .then(()=> pipeIn);
  }

  protected abstract executeImplPayloadIn(rollbackSteps: string[], pipeIn: PIPE_IN , passedIn: PASSED_IN): Promise<void>;
}
