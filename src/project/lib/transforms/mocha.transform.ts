/*
Created by Franz Zemen 03/22/2024
License Type: MIT
*/

import {TransformIndependent} from "../../pipeline/index.js";
import {Executable, ExecutablePayload} from "../../util/index.js";

export class MochaTransform extends TransformIndependent {
  protected executable: Executable<ExecutablePayload>;

  constructor(depth: number) {
    super(depth);
    this.executable = new Executable<ExecutablePayload>(this.contextLog);

  }

  protected override executeImplIndependent(rollbackSteps: string[]): Promise<void> {
    return this.executable.exec({
                                  executable: 'mocha',
                                  arguments: ['/out/test/**/*.test.js'],
                                  batchTarget: false,
                                  synchronous: true,
                                  cwd: './'
                                })
      .then(result => {});
  }

  protected override transformContext(pipeIn?: any, payload?: undefined): string | object {
    return 'mocha test runner';
  }

}

