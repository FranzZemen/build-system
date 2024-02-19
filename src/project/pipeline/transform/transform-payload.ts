/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';

export type TransformPayloadConstructor<CLASS extends TransformPayload<PASSED_IN>, PASSED_IN> = new (logDepth: number) => CLASS;


/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipelines payload (piped in):    false
 * Derived classes consume passed in payload (passed in):  true
 * Derived classes produce pipelines data (piped out):      false
 * Pipeline data is altered:                               false
 * Pipeline out = Pipeline in
 */
export abstract class TransformPayload<PASSED_IN> extends Transform<PASSED_IN, undefined, void> {
  protected constructor(depth: number) {
    super(depth);
  }

  public override async execute(rollbackSteps: string [], pipeIn: undefined, passedIn: PASSED_IN): Promise<void> {
    return super.execute(rollbackSteps, pipeIn, passedIn);
  }

  protected executeImpl(rollbackSteps: string[], pipeIn: undefined, passedIn: PASSED_IN): Promise<void> {
    return this.executeImplPayload(rollbackSteps, passedIn)
      .then(()=> pipeIn);
  }

  protected abstract executeImplPayload(rollbackSteps: string[], payload: PASSED_IN): Promise<void>;
}
