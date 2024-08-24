/*
Created by Franz Zemen 04/30/2023
License Type: MIT
*/

import {Executable, ExecutablePayload, readFileAsJson} from '../../util/index.js';

import {Package, packageIsBasePackage} from '../../validate/index.js';
import {NpmVersionIncrement} from './build-npm-version.transform.js';
import {TransformPayloadOut} from '@franzzemen/pipeline';

/**
 * Updates the npm version to the root package as well as the project package, then publishes the project package
 * to distribution out
 */
export class NpmVersionTransform extends TransformPayloadOut<NpmVersionIncrement, Package> {
  protected executable: Executable<ExecutablePayload>;

  constructor(depth: number) {
    super(depth);
    this.executable = new Executable<ExecutablePayload>(this.contextReporter);
  }

  protected transformContext(pipeIn: undefined,
                             payload: NpmVersionIncrement): string | object | Promise<string | object> {
    return `npm version ${payload}`;
  }

  protected executeImplPayloadOut(rollbackSteps: string[], passedIn: NpmVersionIncrement): Promise<Package> {
    return readFileAsJson('./package.json', packageIsBasePackage)
      .then(thePackage => {
        return this.executable.exec({
                                      executable: 'npm version',
                                      arguments: [passedIn],
                                      batchTarget: false,
                                      synchronous: true,
                                      cwd: './'
                                    })
          .then(result => {
            rollbackSteps.splice(0, 0, `rollback ./package.json to version ${thePackage.version} in git`);
            return readFileAsJson('./package.json', packageIsBasePackage);
          });
      });
  }
}
