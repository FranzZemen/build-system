/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {Log} from "../../log/index.js";
import {TaskPayload} from "../../pipeline/transform/transform-task-payload.js";
import {Task} from "../../pipeline/task/task.js";
import {rename} from "node:fs/promises";
import {backupDirectory} from "./create-backup-diretory.task.js";
import {join} from "node:path";
import {access} from "fs/promises";



export function backupFile (log: Log, rollbackSteps: string[], filename: string): Promise<void> {
  // Simple implementation since we're assuming everything is in root...but would need to separate path from actual file name otherwise
  return access(filename)
    .then(() => {
      const target = join(backupDirectory, filename);
      return rename(filename, target)
        .then(() => {
          rollbackSteps.splice(0, 0, `move ${target} to ${filename}`);
        });
    })
    .catch((err: unknown) => {
      log.info(`file ${filename} does not exist, skipping backup`, 'task-internal');
    })
}
