/*
Created by Franz Zemen 02/13/2023
License Type: 
*/

import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {Transform} from '@franzzemen/pipeline';
import objectPath from 'object-path';
import {merge} from '../../util/merge.js';

export type RemoveIf = {
  ifPath: string[];
  if: 'exists';
}

export type MergeIf = {
  ifPath: string[];
  if: 'exists';
  merge: any;
}

export type MaleatePackagePayload = {
  targetPath: string;
  exclusions?: string[];
  merge?: any;
  mergeIf?: MergeIf[];
  removeIf?: RemoveIf[];
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
      pipeIn = merge(pipeIn, payload.merge);
    }
    if (payload?.mergeIf) {
      for(const mergeIf of payload.mergeIf) {
        if (mergeIf.if === 'exists') {
          this.contextReporter.info(`Merging properties if path exists: ${mergeIf.ifPath.join('.')}`);
          if (objectPath.get(pipeIn as object, mergeIf.ifPath) !== undefined) {
            this.contextReporter.info(`Path exists. Merging properties`);
            this.contextReporter.info(mergeIf.merge);
            pipeIn = merge(pipeIn, mergeIf.merge);
          } else {
            this.contextReporter.info('Path does not exist. Skipping merge');
          }
        }
      }
    }
    if(payload?.removeIf) {
      for(const removeIf of payload.removeIf) {
        if (removeIf.if === 'exists') {
          this.contextReporter.info(`Removing properties if path exists: ${removeIf.ifPath.join('.')}`);
          if (objectPath.get(pipeIn as object, removeIf.ifPath) !== undefined) {
            this.contextReporter.info(`Path exists. Removing properties`);
            objectPath.del(pipeIn as object, removeIf.ifPath);
          } else {
            this.contextReporter.info('Path does not exist. Skipping remove');
          }
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
