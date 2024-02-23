/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/

import {TransformPayloadIn} from "../../pipeline/index.js";
import {writeFile} from "fs/promises";

export type WriteObjectFileNamePayload = {
  targetPath: string;
}

export class WriteObjectToJsonTransform extends TransformPayloadIn<WriteObjectFileNamePayload, any> {
  constructor(depth: number) {
    super(depth);
  }

  protected executeImplPayloadIn(backoutSteps: string[], payload: WriteObjectFileNamePayload, input: any): Promise<void> {
    backoutSteps.splice(0, 0, `Undo write to ${payload.targetPath}`)
    return writeFile(payload.targetPath, JSON.stringify(input, null, 2));
  }

  protected transformContext(pipeIn: any, passedIn: WriteObjectFileNamePayload | undefined): string {
    return `writing ${passedIn ? passedIn.targetPath : ''}`;
  }
}
