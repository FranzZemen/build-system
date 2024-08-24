/*
Created by Franz Zemen 02/22/2024
License Type: MIT
*/

import {deleteAsync} from "del";
import {TransformIndependent} from '@franzzemen/pipeline';

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
