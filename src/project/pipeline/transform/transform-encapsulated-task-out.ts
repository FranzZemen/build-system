/*
Created by Franz Zemen 03/09/2024
License Type: MIT
*/


import {TransformPayloadOut} from "./transform-payload-out.js";
import {Task} from "../task/task.js";

export class TransformEncapsulatedTaskOut<O> extends TransformPayloadOut<Task<void, O>, O> {
  constructor(depth: number) {
    super(depth);
  }

  protected override async executeImplPayloadOut(rollbackSteps: string[], payload: Task<void, O>): Promise<O> {
    try {
      return payload(this.contextLog, rollbackSteps);
    } catch (error) {
      this.errorCondition = true;
      throw error;
    }
  }

  protected override transformContext(pipeIn?: any, payload?: Task<void, O> | undefined): string | object {
    return payload?.name ?? "Unnamed Encapsulated Task Out";
  }

}
