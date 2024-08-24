/*
Created by Franz Zemen 03/07/2023
License Type: MIT
*/

import {git} from '../../util/git.js';
import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {TransformIndependent} from '@franzzemen/pipeline';

export class CheckInTransform extends TransformIndependent {
  constructor(depth: number) {super(depth);}
  protected executeImplIndependent(rollbackSteps: string[]): Promise<void> {
    return git().add(['*'])
      .then(result => {
        if(result && result.length > 0) {
          const err = new BuildError(`Unexpected result from git.add: ${result}`, undefined, BuildErrorNumber.GitAddError)
          this.contextReporter.error(err);
          throw err;
        } else {
          rollbackSteps.splice(0,0,'Undo git add * as necessary');
        }
      })
  }

  protected transformContext(pipeIn: any, passedIn: undefined): string {
    return 'git add';
  }

}
