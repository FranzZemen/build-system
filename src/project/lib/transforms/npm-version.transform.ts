/*
Created by Franz Zemen 04/30/2023
License Type: MIT
*/

import {Package} from '../../options/index.js';
import {BuildError, BuildErrorNumber, Executable, ExecutablePayload, readFileAsJson} from '../../util/index.js';
import {TransformPayloadOut} from "../../pipeline/index.js";
import {packageIsBasePackage} from "../../validate/index.js";
import {writeFile} from "fs/promises";

export type NpmVersionIncrement = 'patch' | 'minor' | 'major';

/**
 * Updates the npm version to the root package as well as the project package, then publishes the project package
 * to distribution out
 */
export class NpmVersionTransform extends TransformPayloadOut<NpmVersionIncrement, Package> {
  protected executable: Executable<ExecutablePayload>;

  constructor(depth: number) {
    super(depth);
    this.executable = new Executable<ExecutablePayload>(this.contextLog);
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
            rollbackSteps.splice(0, 0, `rollback ./package.json to version ${thePackage.version}`);
            return readFileAsJson('./package.json', packageIsBasePackage)
              .then(mainPackage => {
                return readFileAsJson('./src/project/package.dist.json', packageIsBasePackage)
                  .then(distPackage => {
                    if (mainPackage.version !== undefined) {
                      distPackage.version = mainPackage.version;
                    } else {
                      const errMsg = 'main package version is undefined';
                      this.contextLog.error(errMsg);
                      throw new BuildError(errMsg, undefined, BuildErrorNumber.PackageNotVersioned);
                    }
                    rollbackSteps.splice(0, 0, `rollback ./src/project/package.dist.json to version ${thePackage.version}`);
                    return writeFile('./out/project/package.json', JSON.stringify(distPackage, null, 2), 'utf8')
                      .then(() => distPackage);
                  });
              });
          });
      });
  }
}
