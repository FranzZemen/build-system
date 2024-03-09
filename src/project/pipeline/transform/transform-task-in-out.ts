/*
Created by Franz Zemen 03/09/2024
License Type: MIT
*/

import {Transform} from "./transform.js";
import {Task} from "../task/task.js";

export class TransformTaskInOut<I, O> extends Transform<Task<I, O>, I, O> {
  constructor(depth: number) {
    super(depth);
  }

  protected override async executeImpl(rollbackSteps: string[], pipeIn: I, payload: Task<I, O>): Promise<O> {
    try {
      return await payload(this.contextLog, rollbackSteps, pipeIn);
    } catch (error) {
      this.errorCondition = true;
      throw error;
    }
  }

  protected override transformContext(pipeIn?: I | undefined, payload?: Task<I, O> | undefined): string | object {
    return payload?.name ?? "Unnamed Task In Out";
  }
}
