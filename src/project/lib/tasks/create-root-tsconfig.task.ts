/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {createFile} from "../../util/create-file.js";
import {tsconfigRoot} from "../../template/tsconfig.root.js";
import {Reporter} from '@franzzemen/pipeline';

export async function createRootTsConfig(reporter:Reporter, rollbackSteps: string[]): Promise<void> {
  return createFile(reporter, JSON.stringify(tsconfigRoot, undefined, 2), './tsconfig.json', true)
    .then((created) => {
      if(created) {
        rollbackSteps.splice(0, 0, `delete ./tsconfig.json`);
      }
    });
}
