/*
Created by Franz Zemen 12/15/2022
License Type: MIT
*/

import {v4 as uuidV4} from 'uuid';
import {writeFileSync} from 'fs';
import {Log} from '../log/log.js';
import {Transform, TransformConstructor} from './transform/index.js';
import {BuildError, BuildErrorNumber} from '../util/index.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {clearTiming, endTiming, startTiming} from '../util/timing.js';
import {MergeFunction, MergeType, ParallelPipe} from './parallel-pipe.js';
import {AnyPipe} from './pipe.js';
import {SeriesPipe} from './series-pipe.js';
import {TransformPipe} from './transform-pipe.js';


export type ArrayTwoOrMore<T> = [T, T, ...T[]];
export type PipelineOptions = {
  name: string;
  logDepth: number;
}


export function defaultPipelineOptions(): PipelineOptions {
  return {
    name: `Pipeline-${uuidV4()}`,
    logDepth: 0
  };
}

/**
 * PIPELINE_SERIES_AND_PIPE_IN = The payload starting the pipelines
 * PIPELINE_OUT = The payload coming out of the pipelines (by default the payload remains the same throughout
 */
export class Pipeline<PIPELINE_IN, PIPELINE_OUT = PIPELINE_IN> {
  protected static index = 1;
  log: Log;
  name: string;
  //logDepth: number;
  protected _pipes: AnyPipe[] = [];

  private constructor(options: PipelineOptions) {
    this.name = options.name;
    //this.logDepth = gitOptions.logDepth;
    this.log = new Log(options.logDepth);
  }


  /**
   * If this is not called, the defaultOptions function will be use.
   *
   * @param options
   */
  static options<PIPELINE_IN = void, PIPELINE_OUT = PIPELINE_IN>(options?: PipelineOptions): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    if (options === undefined) {
      options = defaultPipelineOptions();
    }
    return new Pipeline<PIPELINE_IN, PIPELINE_OUT>(options);
  }

  copy(newName?: string, newLogDepth?: number): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    const logDepth = newLogDepth ?? this.log.depth;
    const name = newName ?? this.name;
    const pipeline = new Pipeline<PIPELINE_IN, PIPELINE_OUT>({name, logDepth});
    this._pipes.forEach(pipe => pipeline._pipes.push(pipe.copy(pipeline)));
    return pipeline;
  }

  append(pipeline: Pipeline<any, any>): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    pipeline._pipes.forEach(pipe => this._pipes.push(pipe.copy(this)));
    return this;
  }


  /**
   * Execute a single Transform
   *
   * By default, the pipelines payload flows without altereration, so unless a pipelines element changed the payload upstream or the transforms changes
   * the output, the transforms payload stays the same as the pipelines.  Otherwise the appropriate template types must be supplied
   *
   */

  transform<TRANSFORM_CLASS extends Transform<any, any, any>,
    PASSED_IN = undefined,
    PIPE_IN = PIPELINE_IN,
    PIPE_OUT = PIPE_IN>
  (constructor: TransformConstructor<TRANSFORM_CLASS>, payload?: PASSED_IN): Pipeline<PIPELINE_IN, PIPELINE_OUT> {

    // ----- Declaration separator ----- //
    this._pipes.push(TransformPipe.transform<TRANSFORM_CLASS, PASSED_IN, PIPE_IN, PIPE_OUT>(constructor, this, payload));
    return this;
  };

  transforms(transformClasses: TransformConstructor<any> | TransformConstructor<any>[],
             passedIns?: any | any []): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    if (Array.isArray(transformClasses)) {
      if (passedIns) {
        if (Array.isArray(passedIns)) {
          // Size of arrays must match, we are still 1:1 not mxn.
          if (transformClasses.length === passedIns.length) {
            return transformClasses.reduce((previousValue: Pipeline<any, any>,
                                            currentValue: TransformConstructor<any>,
                                            currentIndex) => {
              return previousValue.transform<any, any, any, any>(currentValue, passedIns[currentIndex]);

            }, this);
          } else {
            throw new Error('transforms:  transforms classes array and payload array do not match');
          }
        } else {
          return transformClasses.reduce((previousValue: Pipeline<any, any>, currentValue: TransformConstructor<any>) => {
            return previousValue.transform<any, any, any, any>(currentValue, passedIns);
          }, this);
        }
      } else {
        return transformClasses.reduce((previousValue: Pipeline<any, any>, currentValue: TransformConstructor<any>) => {
          return previousValue.transform<any, any, any, any>(currentValue);
        }, this);
      }
    } else {
      if (passedIns) {
        if (Array.isArray(passedIns)) {
          return passedIns.reduce((previousValue: Pipeline<PIPELINE_IN, PIPELINE_OUT>, currentValue: any) => {
            return previousValue.transform<any, any, any, any>(transformClasses, currentValue);
          }, this);
        } else {
          return this.transform<any, any, any, any>(transformClasses, passedIns);
        }
      } else {
        return this.transform<any, any, any, any>(transformClasses);
      }
    }
  }

  /**
   * Start a series of transforms.  Default is for the pipelines payload to be maintained (not altered)
   */
  startSeries<
    TRANSFORM_CLASS extends Transform<any, any, any>,
    PASSED_IN = undefined,
    SERIES_IN = PIPELINE_IN,
    SERIES_OUT = PIPELINE_IN>(transformClass: TransformConstructor<TRANSFORM_CLASS>,
                              passedIn?: PASSED_IN): SeriesPipe<SERIES_IN, SERIES_OUT> {

    // ----- Declaration separator ----- //
    const seriesPipe = SeriesPipe.start<
      TRANSFORM_CLASS,
      PASSED_IN,
      SERIES_IN,
      SERIES_OUT>(transformClass, this, passedIn);
    this._pipes.push(seriesPipe);
    return seriesPipe;
  };

  /**
   * Continue the series, by default with the pipelines payload
   */
  series<
    SERIES_IN = PIPELINE_IN,
    SERIES_OUT = PIPELINE_IN>(transformClasses: TransformConstructor<any>[],
                              passedIns: ArrayTwoOrMore<any | undefined> []): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    return transformClasses.reduce((previousValue: any, currentValue, currentIndex) => {
      // Even though ArrayTwoOrMore guards minimum length from a type perspective, let's put in a run time check.  We have to match lengths between
      // Arrays anyway
      if (transformClasses.length != passedIns.length) {
        throw new Error('Array lengths do not match');
      } else if (passedIns.length < 2) {
        throw new Error('Minimum array length is 2 for a series');
      }
      if (previousValue === undefined) {
        return this.startSeries<any, any, any, any>(currentValue, passedIns[currentIndex]);
      } else if (currentIndex === passedIns?.length - 1) {
        return (previousValue as SeriesPipe<SERIES_IN, SERIES_OUT>).endSeries<any, any>(currentValue,
                                                                                        passedIns[currentIndex]);
      } else {
        return (previousValue as SeriesPipe<SERIES_IN, SERIES_OUT>).series<any, any>(currentValue,
                                                                                     passedIns[currentIndex]);
      }
    }, undefined);
  }


  /**
   * Start parallel transforms, defaulting to pipelines payload in and out (and appropriate merge flag)
   **/
  startParallel<
    TRANSFORM_CLASS extends Transform<any, any, any>,
    PASSED_IN = undefined,
    PARALLEL_IN = PIPELINE_IN,
    PARALLEL_OUT = PIPELINE_IN>(constructor: TransformConstructor<TRANSFORM_CLASS>, payload?: PASSED_IN): ParallelPipe<PARALLEL_IN, PARALLEL_OUT> {
    // ----- Declaration separator ----- //
    const parallelPipe = ParallelPipe.start<
      TRANSFORM_CLASS,
      PASSED_IN,
      PARALLEL_IN,
      PARALLEL_OUT>(constructor, this, payload);
    this._pipes.push(parallelPipe);
    return parallelPipe;
  };

  parallels<PARALLEL_IN = PIPELINE_IN, PARALLEL_OUT = PIPELINE_IN>(transformClasses: TransformConstructor<any>[],
                                                                   mergeStrategy: [type: MergeType, mergeFunction?: MergeFunction<PARALLEL_OUT>] = ['asAttributes'],
                                                                   passedIns: (any | undefined)[]): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    return transformClasses.reduce((previousValue: any, currentValue, currentIndex) => {
      if (transformClasses.length != passedIns.length) {
        throw new Error('Array lengths do not match');
      } else if (passedIns.length < 2) {
        throw new Error('Minimum array length is 2 for a parallel');
      }
      if (previousValue === undefined) {
        return this.startParallel<any, any, any, any>(currentValue, passedIns[currentIndex]);
      } else if (currentIndex === transformClasses.length - 1) {
        return (previousValue as ParallelPipe<PARALLEL_IN, PARALLEL_OUT>).endParallel<any, any>(currentValue,
                                                                                                mergeStrategy,
                                                                                                passedIns[currentIndex]);
      } else {
        return (previousValue as ParallelPipe<PARALLEL_IN, PARALLEL_OUT>).parallel<any, any>(currentValue,
                                                                                             passedIns[currentIndex]);
      }
    }, undefined);
  }


  // Pipeline.gitOptions()
  // .forEach(directories, predicate or predicate array [], will take the last of 'transforms', 'series' , 'parallel', in nothing defaults to aciton

  async execute(pipelineIn: PIPELINE_IN): Promise<PIPELINE_OUT> {
    const rollbackSteps: string[] = [];
    this.log.info(`starting pipeline ${this.name}...`, 'pipeline');

    const timingMark = `Timing ${Pipeline.name}:${this.name}.execute`;
    const startTimingSuccessful = startTiming(timingMark, this.log);

    let inputPayload = pipelineIn;
    let outputPayload: PIPELINE_OUT | undefined;
    // const results: ExecutionResult<any, any, any, any> [] = [];
    try {
      for (let i = 0; i < this._pipes.length; i++) {
        const pipe: AnyPipe | undefined = this._pipes[i];
        if (pipe) {
          let result = await pipe.execute(rollbackSteps, inputPayload);
          inputPayload = result;
          outputPayload = result;
        } else {
          throw new BuildError('Unreachable code', undefined, BuildErrorNumber.UnreachableCode);
        }
      }
      this.log.info(`...pipeline ${this.name} completed ${startTimingSuccessful ? endTiming(timingMark, this.log) : ''}`, 'pipeline');
      return outputPayload as PIPELINE_OUT;
    } catch (err) {
      this.log.info(`...pipeline ${this.name} failed`, 'error');
      throw processUnknownError(err, this.log);
    } finally {
      this.log.info(`Undo steps:`, 'pipeline');
      let undoSteps = '';
      for(let step of rollbackSteps) {
        undoSteps += `\t${step}\n`;
      }
      this.log.info(undoSteps, 'pipeline');
      writeFileSync('project-init-undo.txt', undoSteps);
      this.log.info(`Undo steps saved to build-system-init-undo.txt`, 'pipeline');

      clearTiming(timingMark);
    }
  }
}

