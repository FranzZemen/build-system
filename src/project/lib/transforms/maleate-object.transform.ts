/*
Created by Franz Zemen 02/13/2023
License Type: 
*/

import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {Transform} from '@franzzemen/pipeline';


export type MaleatePackagePayload = {
  targetPath: string;
  exclusions?: string[];
  merge?: any;
};

/**
 *  Updates the package.json file, adding or removing properties.
 */
export class MaleateObjectTransform<T> extends Transform<MaleatePackagePayload, T, T> {
  constructor(depth: number) {
    super(depth);
  }

  protected override async executeImpl(rollbackSteps: string[], pipeIn: T,
                                       payload?: MaleatePackagePayload | undefined): Promise<T> {
    if (!payload) {
      const err: BuildError = new BuildError('Unreachable code: no payload', undefined, BuildErrorNumber.MissingPayload);
      this.contextReporter.error(err)
      throw err;
    }
    if (payload?.exclusions) {
      payload.exclusions.forEach(exclusion => delete ((pipeIn as any)[exclusion]));
    }
    if (payload?.merge) {
      pipeIn = {...pipeIn, ...payload.merge};
    }
    return pipeIn;
  }

  protected override transformContext(pipeIn?: T | undefined,
                                      payload?: MaleatePackagePayload | undefined): string | object {
    return 'maleating object';
  }

  /*
    protected async executeImplPayload(backoutSteps: string[], payload: MaleatePackagePayload): Promise<void> {
      if (!payload) {
        return;
      }
      const jsonStr = await readFile(path.join(process.cwd(), './package.json'), {encoding: 'utf-8'});
      const packageJson = JSON.parse(jsonStr) as Package;
      if (payload?.exclusions) {
        payload.exclusions.forEach(exclusion => delete packageJson[exclusion]);
      }
      if (payload?.inclusions) {
        Object.getOwnPropertyNames(payload.inclusions).forEach(property => {
          if (payload.inclusions) {
            packageJson[property] = payload.inclusions[property]
          }
        });
      }
      await writeFile(path.join(process.cwd(), payload.targetPath), JSON.stringify(packageJson, undefined, 2), {encoding: 'utf-8'});
    }

    protected transformContext(pipeIn: MaleatePackagePayload | undefined, passedIn: MaleatePackagePayload): string | object {
      return 'maleating object';
    }

   */
}
