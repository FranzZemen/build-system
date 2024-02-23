/*
Created by Franz Zemen 02/22/2024
License Type: MIT
*/

import {Pipeline} from "../../pipeline/index.js";
import {ExecutableTransform} from "../transforms/index.js";
import {ExecutablePayload} from "../../util/index.js";

export const transpilePayload: ExecutablePayload = {
  executable: 'tsc',
  arguments: ['-b'],
  stderrTreatment: "error",
  stdioTreatment: "task-detail",
  batchTarget: false,
  synchronous: true
}

export const transpilePipeline = Pipeline
  .options({name: 'transpile', logDepth: 0})
.transform(ExecutableTransform, transpilePayload);
