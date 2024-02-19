
/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/


import {Log} from "../../log/index.js";
import {createDirectory} from "../../util/create-directory.js";

export const backupDirectory = './bs.backup';

export function createBackupDirectory(log:Log, rollbackSteps: string[]): Promise<void> {
  return createDirectory(log, backupDirectory, true)
    .then((created) => {
      if(created) {
        rollbackSteps.splice(0, 0, `delete ${backupDirectory}`);
      }
      return;
    })
}
