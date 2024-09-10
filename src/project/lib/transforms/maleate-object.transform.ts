/*
Created by Franz Zemen 02/13/2023
License Type: 
*/

import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {Transform} from '@franzzemen/pipeline';
import objectPath from 'object-path';

export type MergeIf = {
  ifPath: string[];
  if: 'exists';
  merge: any;
}

export type MaleatePackagePayload = {
  targetPath: string;
  exclusions?: string[];
  merge?: any;
  mergeIf?: MergeIf;
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
      this.contextReporter.info(`Excluding properties: ${payload.exclusions.join(', ')}`);
      payload.exclusions.forEach(exclusion => delete ((pipeIn as any)[exclusion]));
    }
    if (payload?.merge) {
      this.contextReporter.info(`Merging properties`);
      this.contextReporter.info(payload.merge);
      pipeIn = {...pipeIn, ...payload.merge};
    }
    if(payload?.mergeIf) {
      if(payload.mergeIf.if === 'exists') {
        this.contextReporter.info(`Merging properties if path exists: ${payload.mergeIf.ifPath.join('.')}`);
        if(objectPath.get(pipeIn as object, payload.mergeIf.ifPath) !== undefined) {
          this.contextReporter.info(`Path exists. Merging properties`);
          this.contextReporter.info(payload.mergeIf.merge);
          pipeIn = {...pipeIn, ...payload.mergeIf.merge};
        } else {
          this.contextReporter.info(`Path does not exist. Skipping merge`);
        }
      }
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
