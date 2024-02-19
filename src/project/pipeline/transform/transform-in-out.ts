/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';


export type TransformInOutConstructor<
  CLASS extends TransformInOut<PIPE_IN, PIPE_OUT>, PIPE_IN, PIPE_OUT> = new (logDepth: number) => CLASS;


/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipelines payload (piped in):    true
 * Derived classes consume passed in payload (passed in):  false
 * Derived classes produce pipelines data (piped out):      true
 * Pipeline data is altered:                               true
 * Pipeline out = Derived class out
 *
 */
export abstract class TransformInOut<PIPE_IN, PIPE_OUT> extends Transform<undefined, PIPE_IN, PIPE_OUT> {

  protected constructor(depth: number) {
    super(depth);
  }

  public override async execute(rollbackSteps: string[], payload: PIPE_IN, passedIn = undefined): Promise<PIPE_OUT> {
    return super.execute(rollbackSteps,payload, undefined);
  }

  protected executeImpl(rollbackSteps: string[], pipeIn: PIPE_IN, passedIn?: undefined): Promise<PIPE_OUT> {
    return this.executeImplInOut(rollbackSteps,pipeIn);
  }

  protected abstract executeImplInOut(rollbackSteps: string[], pipedIn: PIPE_IN): Promise<PIPE_OUT>;
}
