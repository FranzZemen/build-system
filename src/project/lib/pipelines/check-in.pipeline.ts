/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/


import {Pipeline} from "../../pipeline/index.js";
import {CheckInTransform} from "../transforms/index.js";

export const checkInPipeline = Pipeline
  .options({name: 'checkInPipeline', logDepth: 0})
  .transform(CheckInTransform);
