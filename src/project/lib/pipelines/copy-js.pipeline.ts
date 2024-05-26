/*
Created by Franz Zemen 03/17/2024
License Type: MIT
*/


import {Pipeline} from "../../pipeline/index.js";
import {CopyPayload, CopyTransform} from "../transforms/copy.transform.js";

export const copyJsPipeline = Pipeline
  .options({name: 'copyJS', logDepth: 0})
  .transform<CopyTransform, CopyPayload>(CopyTransform, {
    src: './src',
    dest: './out',
    glob: ['**/*.js', '**/*.cjs', '**/*.mjs'], // Added '**/*.ts', '**/*.tsx
    ignore: [],
    overwrite: true
  });
