/*
Created by Franz Zemen 03/09/2024
License Type: MIT
*/

import {TransformInOut} from "../../pipeline/index.js";
import {BuildSystemAnalysis} from "../../util/index.js";
import {simpleGit, SimpleGit} from "simple-git";

export class GitInitTransform extends TransformInOut<BuildSystemAnalysis, BuildSystemAnalysis> {
  constructor(depth: number) {
    super(depth);
  }

  protected override async executeImplInOut(rollbackSteps: string[], analysis: BuildSystemAnalysis): Promise<BuildSystemAnalysis> {
    if(analysis.gitInitialized) {
      this.contextLog.warn('Git already initialized, skipping');
    } else {
      const git: SimpleGit = simpleGit();
      const result = await git.init();
      this.contextLog.info(result, 'task-internal');
      analysis.gitInitialized = true;
    }
    return analysis;
  }

  protected override transformContext(pipeIn?: BuildSystemAnalysis | undefined, payload?: undefined): string | object {
    return 'Git initialization';
  }
}
