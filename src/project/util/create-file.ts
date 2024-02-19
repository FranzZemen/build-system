/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {access, writeFile} from "fs/promises";
import {BuildError, BuildErrorNumber} from "./index.js";
import {mkdir} from "node:fs/promises";
import {Log} from "../log/index.js";

export function createFile(log: Log, contents: string, file: string, errorOnExists = true): Promise<boolean> {
  return access(file)
    .then(() => {
      // Directory exists
      if (errorOnExists === true) {
        throw new BuildError(
          `File ${file} already exists and errorOnExists = true`,
          undefined, BuildErrorNumber.FileAlreadyExists);
      } else {
        const msg = `File ${file} already exists, not updating and continuing`;
        log.warn(msg);
        return false;
      }
    })
    .catch((err: unknown) => {
      if (err instanceof BuildError) {
        throw err;
      } else {
        // Does not exist, create it
        return writeFile(file, contents, {encoding: 'utf-8'})
          .then(() => {
            log.info(`created file ${file}`, 'task-internal');
            return true;
          })
      }
    })
}
