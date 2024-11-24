/*
Created by Franz Zemen 02/22/2024
License Type: MIT
*/

import {ExecutableTransform} from "../transforms/index.js";
import {ExecutablePayload} from "../../util/index.js";
import {Pipeline} from '@franzzemen/pipeline';

export const transpilePayload: ExecutablePayload = {
  executable: 'tsc',
  // arguments: ['-b'],
  arguments: [],
  stderrTreatment: "error",
  stdioTreatment: "task-detail",
  batchTarget: false,
  synchronous: true
}

export const transpilePipeline = Pipeline
  .options({name: 'transpile', logDepth: 0})
.transform(ExecutableTransform, transpilePayload);
