/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {Pipeline, TransformConstructor} from "../../pipeline/index.js";
import {AnalyzeTransform} from "../transforms/index.js";
import {BuildSystemAnalysis} from "../../util/index.js";

export const initPipeline: Pipeline<void, boolean> = Pipeline
  .options<void, boolean>({name:'Project build system initialization', logDepth: 1})
  .transform<AnalyzeTransform, void, void, BuildSystemAnalysis>(AnalyzeTransform);
  /*
  .startSeries(TransformEncapsulatedTask, checkESMProject)
  .series(TransformEncapsulatedTask, checkESMProject)
  .series(TransformEncapsulatedTask, createBackupDirectory)
  .series(TransformTaskPayload<string>, {task: backupFile, taskArgument: './tsconfig.json'})
  .endSeries(TransformEncapsulatedTask, createRootTsConfig)
  */
