/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {Pipeline} from "../../pipeline/index.js";
import {checkNewProject} from "../tasks/check-new-project.task.js";
import {TransformEncapsulatedTaskOut} from "../../pipeline/transform/transform-encapsulated-task-out.js";

export const initPipeline: Pipeline<void, boolean> = Pipeline
  .options<void, boolean>({name:'init', logDepth: 1})
  .transform(TransformEncapsulatedTaskOut<boolean>, checkNewProject);
  /*
  .startSeries(TransformEncapsulatedTask, checkESMProject)
  .series(TransformEncapsulatedTask, checkESMProject)
  .series(TransformEncapsulatedTask, createBackupDirectory)
  .series(TransformTaskPayload<string>, {task: backupFile, taskArgument: './tsconfig.json'})
  .endSeries(TransformEncapsulatedTask, createRootTsConfig)
  */
