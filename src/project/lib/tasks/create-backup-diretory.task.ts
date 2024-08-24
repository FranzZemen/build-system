
/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/


import {createDirectory} from "../../util/create-directory.js";
import {Reporter} from '@franzzemen/pipeline';

export const backupDirectory = './bs.backup';

export function createBackupDirectory(reporter:Reporter, rollbackSteps: string[]): Promise<void> {
  return createDirectory(reporter, backupDirectory, true)
    .then((created) => {
      if(created) {
        rollbackSteps.splice(0, 0, `delete ${backupDirectory}`);
      }
      return;
    })
}
