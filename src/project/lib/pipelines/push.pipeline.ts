/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/
import {Pipeline} from "../../pipeline/index.js";
import {PushBranchTransform} from "../transforms/index.js";

export const pushPipeline = Pipeline
  .options({name: 'publishPipeline', logDepth: 0})
  .transform(PushBranchTransform);
