/*
Created by Franz Zemen 03/10/2023
License Type: MIT
*/

import {git} from '../../util/git.js';
import {TransformIndependent} from "../../pipeline/index.js";


export class PushBranchTransform extends TransformIndependent {
  constructor(depth:number) {super(depth);}
  protected executeImplIndependent(rollbackSteps: string[]): Promise<void> {
    return git().push().then(result => {
      this.contextLog.info(result)
      rollbackSteps.splice(0,0,'Undo git push manually?');
    });
  }

  protected async transformContext(pipeIn: any, passedIn: undefined): Promise<string> {
    const branchName = await git().currentBranch();
    return `push origin ${branchName}`;
  }

}
