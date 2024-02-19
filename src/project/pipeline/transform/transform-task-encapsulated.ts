/*
Created by Franz Zemen 02/18/2024
License Type: 
*/

import {Transform} from "./transform.js";
import {EncapsulatedTask} from "../task/task.js";
import {TransformPayload} from "./transform-payload.js";
import {BuildError} from "../../util/index.js";

export class TransformTaskEncapsulated extends TransformPayload<EncapsulatedTask> {
  constructor(depth: number) {
    super(depth);
  }

  protected override async executeImplPayload(rollbackSteps: string[], payload: EncapsulatedTask): Promise<void> {
    try {
      return await payload(this.contextLog, rollbackSteps);
    } catch (error) {
      this.errorCondition = true;
      throw error;
    }
  }

  protected override transformContext(pipeIn?: undefined, payload?: EncapsulatedTask | undefined): string | object {
    return payload?.name ?? "Unnamed Encapsulated Task";
  }
}
