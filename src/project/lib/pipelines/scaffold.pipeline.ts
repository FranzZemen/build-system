/*
Created by Franz Zemen 06/23/2024
License Type: MIT
*/

import {Pipeline} from "../../pipeline/index.js";
import {CreateDirectoryPayload, CreateDirectoryTransform} from '../transforms/create-directory.transform.js';
import {WriteObjectFileNamePayload, WriteObjectToJsonTransform} from '../transforms/write-object-to-json.transform.js';
import {tsConfigBase} from '../../template/tsconfig.base.js';


export const scaffoldPipeline = Pipeline.options({name: 'scaffold', logDepth: 0});
scaffoldPipeline
  .transform<CreateDirectoryTransform, CreateDirectoryPayload>(CreateDirectoryTransform,{path:'./src/project'})
  .transform<CreateDirectoryTransform, CreateDirectoryPayload>(CreateDirectoryTransform,{path:'./src/test'})
  .transform<WriteObjectToJsonTransform, WriteObjectFileNamePayload>(WriteObjectToJsonTransform, {targetPath: './src/project/tsconfig.json', input: tsConfigBase});
