/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {AnalyzeTransform, GitInitTransform} from "../transforms/index.js";
import {BuildSystemAnalysis} from "../../util/index.js";
import {Pipeline} from '@franzzemen/pipeline';

export const initPipeline: Pipeline<void, boolean> = Pipeline
  .options<void, boolean>({name: 'Project build system initialization', logDepth: 1})
  .transform<AnalyzeTransform, void, void, BuildSystemAnalysis>(AnalyzeTransform)
  .transform <GitInitTransform, void, BuildSystemAnalysis, BuildSystemAnalysis>(GitInitTransform);
