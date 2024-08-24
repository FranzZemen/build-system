/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {access} from "fs/promises";
import {mkdir} from "node:fs/promises";
import {BuildError, BuildErrorNumber} from "./build-error.js";
import {Reporter} from '@franzzemen/pipeline';


export async function createDirectory(log: Reporter, directory: string, errorOnExists = true): Promise<boolean> {
  return access(directory)
    .then(() => {
      // Directory exists
      if (errorOnExists === true) {
        throw new BuildError(
          `Directory ${directory} already exists and errorOnExists = true`,
          undefined, BuildErrorNumber.DirectoryAlreadyExists);
      } else {
        const msg = `Directory ${directory} already exists, continuing`;
        log.warn(msg);
        return false;
      }
    })
    .catch((err: unknown) => {
      if (err instanceof BuildError) {
        throw err;
      } else {
        // Does not exist, create it
        return mkdir(directory, {recursive: true})
          .then(() => {
            log.info(`created directory ${directory}`, 'task-internal');
            return true;
          })
      }
    })
}
