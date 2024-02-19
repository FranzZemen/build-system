/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {Pipeline} from "../../pipeline/index.js";
import {TransformTaskEncapsulated} from "../../pipeline/transform/transform-task-encapsulated.js";
import {checkESMProject} from "../tasks/check-esm-project.task.js";
import {createBackupDirectory} from "../tasks/create-backup-diretory.task.js";
import {TransformTaskPayload} from "../../pipeline/transform/transform-task-payload.js";
import {backupFile} from "../tasks/backup-file.task.js";
import {createRootTsConfig} from "../tasks/create-root-tsconfig.task.js";

export const initPipeline: Pipeline<void, void> = Pipeline
  .options({name:'init', logDepth: 1})
  .startSeries(TransformTaskEncapsulated, checkESMProject)
  .series(TransformTaskEncapsulated, checkESMProject)
  .series(TransformTaskEncapsulated, createBackupDirectory)
  .series(TransformTaskPayload<string>, {task: backupFile, taskArgument: './tsconfig.json'})
  .endSeries(TransformTaskEncapsulated, createRootTsConfig)

