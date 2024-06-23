/*
Created by Franz Zemen 06/23/2024
License Type: MIT
*/

import {Pipeline} from "../../pipeline/index.js";
import {CreateDirectoryPayload, CreateDirectoryTransform} from '../transforms/create-directory.transform.js';


export const scaffoldPipeline = Pipeline.options({name: 'scaffold', logDepth: 0});
scaffoldPipeline
  .transform<CreateDirectoryTransform, CreateDirectoryPayload>(CreateDirectoryTransform,{path:'./src/project'})
  .transform<CreateDirectoryTransform, CreateDirectoryPayload>(CreateDirectoryTransform,{path:'./src/test'});
