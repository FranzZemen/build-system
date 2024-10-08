/*
Created by Franz Zemen 03/11/2023
License Type: MIT
*/

import FastGlob from 'fast-glob';
import {copyFile} from 'fs/promises';
import {mkdir} from 'node:fs/promises';
import {join, dirname} from 'node:path';
import {cwd} from 'node:process';
import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {TransformPayload} from '@franzzemen/pipeline';


export type CopyPayload = {
  // Source directory
  src: string,
  // Destination directory
  dest: string,
  // Glob pattern to match files
  glob: string | string[],
  // Glob pattern to ignore files
  ignore?: string[],
  // Follow symbolic links
  followSymbolicLinks?: boolean,
  // Overwrite existing files
  overwrite: true | false
}

export class CopyTransform extends TransformPayload<CopyPayload> {
  constructor(depth: number) {
    super(depth);
  }

  protected async executeImplPayload(backoutSteps: string[], payload: CopyPayload): Promise<void> {
    const currentWorkingDirectory = cwd();


    await FastGlob(payload.glob, {cwd: join(currentWorkingDirectory, payload.src), followSymbolicLinks: payload.followSymbolicLinks ?? true, ignore: payload.ignore ?? []})
      .then(files => {
        const copyPromises: Promise<void>[] = [];
        const sourceFileNames: string[] = [];
        files.forEach(file => {
          // Use Promise.all to aggregate all the file copies
          const sourceFileName = join(currentWorkingDirectory, payload.src, file);
          const destFileName = join(currentWorkingDirectory, payload.dest, file);
          const destDirectory = dirname(destFileName);
          this.contextReporter.debug(`copying from ${sourceFileName} to ${destFileName}`, 'context');
          sourceFileNames.push(sourceFileName);
          copyPromises.push(mkdir(destDirectory, {recursive: true}).then(()=> copyFile(sourceFileName, destFileName)));
        });
        return Promise
          .allSettled(copyPromises)
          .then(results => {
            const errors: BuildError[] = [];
            results.forEach((result,index) => {
              if (result.status === 'rejected') {
                errors.push(new BuildError(`Error copying file ${sourceFileNames[index]}`, {cause: result.reason}, BuildErrorNumber.CopyFileError))
                this.contextReporter.error(result.reason);
              }
              backoutSteps.splice(0, 0, 'clean output for copied json');
            });
            if(errors.length) {
              const err = new BuildError('Errors copying files: ', {cause: errors}, BuildErrorNumber.CopyFilesError);
              this.contextReporter.error(err);
              errors.forEach(error => this.contextReporter.error(error));
              throw err;
            }
            return;
          });
      });
  }

  protected transformContext(pipeIn: undefined, payload: CopyPayload): string | object {
    return payload;
  }
}
