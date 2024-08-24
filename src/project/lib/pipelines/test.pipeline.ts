/*
Created by Franz Zemen 03/22/2024
License Type: MIT
*/

import {buildPipeline} from "./build.pipeline.js";
import {MochaTransform} from "../transforms/mocha.transform.js";
import {Pipeline} from '@franzzemen/pipeline';

export const testPipeline = Pipeline.options({name: 'test', logDepth: 0});
testPipeline.append(buildPipeline)
  .transform(MochaTransform);

export const testOnlyPipeline: Pipeline<void, void> = Pipeline.options({name: 'test-only', logDepth: 0})
  .transform(MochaTransform);
