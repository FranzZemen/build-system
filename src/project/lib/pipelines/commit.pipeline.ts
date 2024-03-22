/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/


import {Pipeline} from "../../pipeline/index.js";
import {CheckInTransform, CommitTransform} from "../transforms/index.js";
import {testPipeline} from "./test.pipeline.js";

export const commitPipeline = Pipeline
  .options({name: 'checkInPipeline', logDepth: 0})
  .append(testPipeline)
  .transform(CheckInTransform)
  .transform(CommitTransform);
