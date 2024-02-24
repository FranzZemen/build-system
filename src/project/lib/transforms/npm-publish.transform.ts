/*
Created by Franz Zemen 04/30/2023
License Type: MIT
*/

import {Executable, ExecutablePayload, readFileAsJson} from '../../util/index.js';
import {TransformIndependent} from "../../pipeline/index.js";


/**
 * Updates the npm version to the root package as well as the project package, then publishes the project package
 * to distribution out
 */
export class NpmPublishTransform extends TransformIndependent {
  protected executable: Executable<ExecutablePayload>;

  constructor(depth: number) {
    super(depth);
    this.executable = new Executable<ExecutablePayload>(this.contextLog);
  }

  protected override transformContext(pipeIn?: any, payload?: undefined): string | object {
    return `npm publish './out/project'`;
  }

  protected override executeImplIndependent(rollbackSteps: string[]): Promise<void> {
    return this.executable.exec({
                                  executable: 'npm publish',
                                  arguments: ['./out/project'],
                                  batchTarget: false,
                                  synchronous: true,
                                  cwd: './'
                                }).then(() => {
    });
  }


}
