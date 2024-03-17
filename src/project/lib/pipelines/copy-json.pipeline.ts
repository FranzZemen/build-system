/*
Created by Franz Zemen 03/17/2024
License Type: MIT
*/


import {Pipeline} from "../../pipeline/index.js";
import {CopyPayload, CopyTransform} from "../transforms/copy.transform.js";

let CopyJsonTransform;
export const copyJsonPipeline = Pipeline
  .options({name: 'copyJson', logDepth: 0})
  .transform<CopyTransform, CopyPayload>(CopyTransform, {
    src: './src',
    dest: './out',
    glob: '**/*.json',
    ignore: ['tsconfig.json', 'package.json'],
    overwrite: true
  });
