/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';

export type TransformOutConstructor<CLASS extends TransformOut<PIPE_OUT>, PIPE_OUT> = new (logDepth: number) => CLASS;

/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipelines payload (piped in):    false
 * Derived classes consume passed in payload (passed in):  false
 * Derived classes produce pipelines data (piped out):      true
 * Pipeline data is altered:                               true
 * Pipeline out = Derived class out
 */
export abstract class TransformOut<PIPE_OUT> extends Transform<undefined, undefined, PIPE_OUT> {
  protected constructor(depth: number) {
    super(depth);
  }

  public override async execute(rollbackSteps: string[], pipeIn = undefined, passedIn = undefined): Promise<PIPE_OUT> {
    return super.execute(rollbackSteps, pipeIn, passedIn);
  }

  protected executeImpl(rollbackSteps: string[], pipeIn: undefined, passedIn?: undefined): Promise<PIPE_OUT> {
    return this.executeImplOut(rollbackSteps);
  }

  protected abstract executeImplOut(rollbackSteps: string[]): Promise<PIPE_OUT>;
}
