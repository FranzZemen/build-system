/*
Created by Franz Zemen 12/03/2022
License Type: MIT
*/


import {Console} from 'node:console';
import {ConsoleCode} from '../../log/index.js';
import {Log} from '../../log/log.js';
import {processUnknownError} from '../../util/index.js';
import {endTiming, startTiming} from '../../util/timing.js';

export type TransformConstructor<CLASS extends Transform<any, any, any>> = new (logDepth: number) => CLASS;

/**
 * Abstract Transform class.  A Transform is a class that transforms data; data can be intrinsic (obtained by the class through internal means),
 * piped in (provided to the class by the starting Pipeline payload or by the previous Transform, SeriesPipe, or ParallelPipe piped out data, or
 * passed in directly when added to a Pipeline.
 *
 * The transforms declares what kind of data it is sending down the Pipeline as output - this does not have to be the transformed data.
 */
export abstract class Transform<PAYLOAD, PIPED_IN, PIPE_OUT> {
  private readonly log: Log;
  protected contextLog: Log;
  protected errorCondition = false;

  protected constructor(protected depth: number) {
    this.log = new Log(depth);
    this.contextLog = new Log(depth+1);
  }

  copy(newLogDepth?: number): Transform<PAYLOAD, PIPED_IN, PIPE_OUT> {
    const logDepth = newLogDepth ?? this.log.depth;
    const transform = new (this.constructor as TransformConstructor<Transform<PAYLOAD, PIPED_IN, PIPE_OUT>>)(logDepth);
    return transform;
  }

  get logDepth(): number {
    return this.log.depth;
  }

  set logDepth(depth: number) {
    this.log.depth = depth;
  }

  get name(): string {
    return this.constructor.name;
  }

  async execute(rollbackSteps: string [], pipedIn?: PIPED_IN, payloadIn?: PAYLOAD): Promise<PIPE_OUT> {
    const transformContext: string | object = await this.transformContext(pipedIn, payloadIn);
    const maxLineLength = 100;
    if (typeof transformContext === 'string') {
      const length = `transform ${this.name} ${transformContext} starting...`.length;
      if (length > maxLineLength) {
        this.log.info(`transform ${this.name}`);
        this.log.info(`  ${transformContext}`);
        this.log.info('  starting...');
      } else {
        this.log.infoSegments([
                                {data: `transform ${this.name} `, treatment: 'info'},
                                {data: transformContext, treatment: 'context'},
                                {data: ' starting...', treatment: 'info'}]);
      }
    } else {
      this.log.info(`transform ${this.name}`);
      // Use contextLog to indent the object
      this.contextLog.info(transformContext);
    }
    let startTimingSuccessful: boolean = true;
    const timingMark = `Timing ${Transform.name}:${transformContext}:${this.name}.execute`;
    try {
      startTimingSuccessful = startTiming(timingMark, this.log);
      return await this.executeImpl(rollbackSteps, pipedIn, payloadIn);
    } catch (err) {
      return Promise.reject(processUnknownError(err, this.log));
    } finally {
      this.log.info(`...transform ${this.name} ${this.errorCondition ? 'failed' : 'completed'} ${startTimingSuccessful ? endTiming(timingMark, this.log) : ''}`,
                    this.errorCondition ? 'error' : 'task-done');
    }
  }

  protected abstract executeImpl(rollbackSteps: string[], pipeIn?: PIPED_IN, payload?: PAYLOAD): Promise<PIPE_OUT>;

  protected abstract transformContext(pipeIn?: PIPED_IN, payload?: PAYLOAD): string | object;
}
