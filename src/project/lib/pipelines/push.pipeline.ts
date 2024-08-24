/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/
import {PushBranchTransform} from "../transforms/index.js";
import {commitPipeline} from "./commit.pipeline.js";
import {Pipeline} from '@franzzemen/pipeline';

export const pushPipeline = Pipeline
  .options({name: 'publishPipeline', logDepth: 0})
  .append(commitPipeline)
  .transform(PushBranchTransform);
