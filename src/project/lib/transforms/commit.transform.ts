/*
Created by Franz Zemen 03/07/2023
License Type: MIT
*/

import {git} from '../../util/git.js';
import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {input} from '@inquirer/prompts';
import {TransformPayload} from '@franzzemen/pipeline';


export type CommitPayload = {
  comment: string | undefined;
}

export class CommitTransform extends TransformPayload<CommitPayload> {

  constructor(depdth: number) {super(depdth);}

  protected transformContext(pipeIn: any, passedIn: undefined): string {
    return '';
  }

  protected async executeImplPayload(rollbackSteps: string[], payload: CommitPayload): Promise<void> {
    let comment = payload?.comment ?? undefined;
    if (!comment) {
      comment = await input({message: 'Commit comment'});
    }
    if (comment) {
      return git().commit(comment).then(result => {
        this.contextReporter.info(result)
        rollbackSteps.splice(0,0,'Undo git commit as necessary (git revert?)');
      });
    } else {
      throw new BuildError('Unreachable code', undefined, BuildErrorNumber.UnreachableCode);
    }
  }
}
