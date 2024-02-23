/*
Created by Franz Zemen 02/22/2024
License Type: MIT
*/

import {TransformIndependent} from "../../pipeline/index.js";
import {deleteAsync} from "del";

export class CleanTransform extends TransformIndependent {
  constructor(depth: number) {
    super(depth);
  }

  protected override executeImplIndependent(rollbackSteps: string[]): Promise<void> {
    return deleteAsync('./out')
      .then(()=> {});
  }

  protected override transformContext(pipeIn?: any, payload?: undefined): string | object {
    return 'clean';
  }

}
