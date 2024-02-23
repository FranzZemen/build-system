/*
Created by Franz Zemen 03/04/2023
License Type: 
*/

import {BuildError, BuildErrorNumber, readFileAsJson} from '../../util/index.js';
import {TransformPayloadOut} from "../../pipeline/index.js";
import {tIsT} from "../../validate/index.js";

export type ReadObjectFileNamePayload<T> = {
  targetPath: string;
  tIsT?: tIsT<T>;
}

export class ReadObjectTransform<T> extends TransformPayloadOut<ReadObjectFileNamePayload<T>, T> {
  constructor(depth: number) {
    super(depth);
  }

  protected executeImplPayloadOut(backoutSteps: string[], payload: ReadObjectFileNamePayload<T>): Promise<T> {
    if (!payload) {
      return Promise.reject(new BuildError('Unreachable code: no payload', undefined, BuildErrorNumber.UnreachableCode));
    }
    return readFileAsJson<T>(payload.targetPath, payload.tIsT);
  }

  protected transformContext(pipeIn: undefined, passedIn: ReadObjectFileNamePayload<T> | undefined): string {
    return `reading ${passedIn ? passedIn.targetPath : ''}`;
  }

}
