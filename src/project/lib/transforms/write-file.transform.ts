/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/

import {writeFile} from "fs/promises";
import {BuildError, BuildErrorNumber} from "../../util/index.js";
import {TransformPayloadIn} from '@franzzemen/pipeline';

export type WriteFilePayload = {
  target: string;
  contents: string;
}

export class WriteFileTransform extends TransformPayloadIn<WriteFilePayload, any> {
  constructor(depth: number) {
    super(depth);
  }

  protected executeImplPayloadIn(backoutSteps: string[], input: any, payload: WriteFilePayload): Promise<void> {
    backoutSteps.splice(0, 0, `Undo write to ${payload.contents}`)
    if(payload.contents) {
      input = payload.contents; // Overrides transform input
    }
    return writeFile(payload.target, payload.contents)
      .catch(err => {
        this.contextReporter.error(err);
        throw new BuildError('Error writing file', err, BuildErrorNumber.WriteStringToFile);
      });
  }

  protected transformContext(pipeIn: any, passedIn: WriteFilePayload | undefined): string {
    if (passedIn) {
      return `writing ${passedIn?.contents} to ${passedIn?.target}`;
    } else {
      return `writing ${pipeIn.contents} to ${pipeIn.target}`;
    }
  }
}
