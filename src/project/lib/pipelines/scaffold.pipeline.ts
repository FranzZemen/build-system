/*
Created by Franz Zemen 06/23/2024
License Type: MIT
*/

import {CreateDirectoryPayload, CreateDirectoryTransform} from '../transforms/create-directory.transform.js';
import {WriteObjectFileNamePayload, WriteObjectToJsonTransform} from '../transforms/write-object-to-json.transform.js';
import {tsConfigBase} from '../../template/tsconfig.base.js';
import {tsconfigRoot} from '../../template/tsconfig.root.js';
import {tsConfigProject} from '../../template/tsconfig.project.js';
import {tsConfigTest} from '../../template/tsconfig.test.js';
import {MaleatePackagePayload, MaleatePackageTransform} from '../transforms/maleate-package.transform.js';
import {ModuleType} from '../../validate/index.js';
import {WriteFilePayload, WriteFileTransform} from '../transforms/write-file.transform.js';
import {gitignore} from '../../template/.gitignore.js';
import {Pipeline} from '@franzzemen/pipeline';


export const scaffoldPipeline = Pipeline.options({name: 'scaffold', logDepth: 0});
scaffoldPipeline
  .transform<CreateDirectoryTransform, CreateDirectoryPayload>(CreateDirectoryTransform, {path: './src/project'})
  .transform<CreateDirectoryTransform, CreateDirectoryPayload>(CreateDirectoryTransform, {path: './src/test'})
  .transform<WriteObjectToJsonTransform, WriteObjectFileNamePayload>(WriteObjectToJsonTransform, {targetPath: './tsconfig.base.json', input: tsConfigBase})
  .transform<WriteObjectToJsonTransform, WriteObjectFileNamePayload>(WriteObjectToJsonTransform, {targetPath: './tsconfig.json', input: tsconfigRoot})
  .transform<WriteObjectToJsonTransform, WriteObjectFileNamePayload>(WriteObjectToJsonTransform, {targetPath: './src/project/tsconfig.json', input: tsConfigProject})
  .transform<WriteObjectToJsonTransform, WriteObjectFileNamePayload>(WriteObjectToJsonTransform, {targetPath: './src/test/tsconfig.json', input: tsConfigTest})
  .transform<MaleatePackageTransform, MaleatePackagePayload>(MaleatePackageTransform, {
    targetPath: './package.json',
    exclusions: ['main'],
    inclusions: {
      type: ModuleType.module,
      exports: {
        '.': {
          import: './src/project/import.ts'
        }
      },
    }
  })
  .transform<WriteFileTransform,WriteFilePayload>(WriteFileTransform, {target: '.gitignore', contents: gitignore});
