/*
Created by Franz Zemen 06/23/2024
License Type: MIT
*/

import {mkdir} from 'fs/promises';
import {TransformPayload} from '@franzzemen/pipeline';

const subdirectoryPathRegex = /^\.\/.*$/

export type CreateDirectoryPayload = {
  path: string;
}

export class CreateDirectoryTransform extends TransformPayload<CreateDirectoryPayload> {
  constructor(depth: number) {
    super(depth);
  }

  protected override async executeImplPayload(rollbackSteps: string[], payload: CreateDirectoryPayload): Promise<void> {
    try {
      if(payload.path === undefined) {
        throw new Error('Path not provided');
      }
      if(subdirectoryPathRegex.test(payload.path)) {
        return mkdir(payload.path, {recursive: true})
          .then(()=> {
            rollbackSteps.push(`rm -rf ${payload.path}`);
          });
      } else {
        throw new Error('Path must be a subdirectory path starting with ./');
      }
    } catch (error) {
      this.contextReporter.error(error as Error);
    }
  }

  protected override transformContext(pipeIn?: undefined, payload?: CreateDirectoryPayload | undefined): string | object {
    return payload?.path ?? 'path not provided';
  }

}
