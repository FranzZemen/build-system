/*
Created by Franz Zemen 03/09/2024
License Type: MIT
*/

import {BuildSystemAnalysis} from "../../util/index.js";
import {simpleGit, SimpleGit} from "simple-git";
import {TransformInOut} from '@franzzemen/pipeline';

export class GitInitTransform extends TransformInOut<BuildSystemAnalysis, BuildSystemAnalysis> {
  constructor(depth: number) {
    super(depth);
  }

  protected override async executeImplInOut(rollbackSteps: string[], analysis: BuildSystemAnalysis): Promise<BuildSystemAnalysis> {
    if(analysis.gitInitialized) {
      this.contextReporter.warn('Git already initialized, skipping');
    } else {
      const git: SimpleGit = simpleGit();

      const result = await git.init();
      this.contextReporter.info(result, 'task-internal');
      rollbackSteps.splice(0, 0, 'rollback git init');



      analysis.gitInitialized = true;
    }
    return analysis;
  }

  protected override transformContext(pipeIn?: BuildSystemAnalysis | undefined, payload?: undefined): string | object {
    return 'Git initialization';
  }

}
