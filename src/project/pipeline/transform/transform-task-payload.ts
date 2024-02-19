/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {TransformPayload} from "./transform-payload.js";
import {Task} from "../task/task.js";

export type TaskPayload<T> = {
  task: Task<T,void>;
  taskArgument: T;
}

export class TransformTaskPayload<T>
  extends TransformPayload<TaskPayload<T>> {
  constructor(depth: number) {
    super(depth);
  }

  protected override executeImplPayload(rollbackSteps: string[], payload: TaskPayload<T>): Promise<void> {
    return payload.task(this.contextLog, rollbackSteps, payload.taskArgument);
  }

  protected override transformContext(pipeIn?: undefined,
                                      payload?: TaskPayload<T> | undefined): string | object {
    return payload?.task?.name ?? 'Unnamed Task ' + payload?.taskArgument?? 'Unnamed';
  }

}

