/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {Log} from "../../log/index.js";
import {createFile} from "../../util/create-file.js";
import {tsconfigRoot} from "../../template/tsconfig.root.js";

export async function createRootTsConfig(log:Log, rollbackSteps: string[]): Promise<void> {
  return createFile(log, JSON.stringify(tsconfigRoot, undefined, 2), './tsconfig.json', true)
    .then((created) => {
      if(created) {
        rollbackSteps.splice(0, 0, `delete ./tsconfig.json`);
      }
    });
}
