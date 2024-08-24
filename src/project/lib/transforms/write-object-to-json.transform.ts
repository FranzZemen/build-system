/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/

import {writeFile} from "fs/promises";
import {BuildError, BuildErrorNumber} from "../../util/index.js";
import {TransformPayloadIn} from '@franzzemen/pipeline';

export type WriteObjectFileNamePayload = {
  targetPath: string;
  input?: any;
}

export class WriteObjectToJsonTransform extends TransformPayloadIn<WriteObjectFileNamePayload, any> {
  constructor(depth: number) {
    super(depth);
  }

  protected executeImplPayloadIn(backoutSteps: string[], input: any, payload: WriteObjectFileNamePayload): Promise<void> {
    backoutSteps.splice(0, 0, `Undo write to ${payload.targetPath}`)
    if(payload.input) {
      input = payload.input; // Overrides transform input
    }
    return writeFile(payload.targetPath, JSON.stringify(input, null, 2))
      .catch(err => {
        this.contextReporter.error(err);
        throw new BuildError('Error writing file', err, BuildErrorNumber.WriteObjectToJsonError);
      });
  }

  protected transformContext(pipeIn: any, passedIn: WriteObjectFileNamePayload | undefined): string {
    if(passedIn) {
      return `writing ${passedIn?.targetPath}`;
    } else {
      return `writing ${pipeIn.targetPath}`;
    }
  }
}
