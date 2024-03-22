/*
Created by Franz Zemen 03/22/2024
License Type: MIT
*/

import {Pipeline} from "../../pipeline/index.js";
import {buildPipeline} from "./build.pipeline.js";
import {MochaTransform} from "../transforms/mocha.transform.js";

export const testPipeline = Pipeline.options({name: 'test', logDepth: 0});
testPipeline.append(buildPipeline)
  .transform(MochaTransform);
