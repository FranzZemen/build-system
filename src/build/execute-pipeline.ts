/*
Created by Franz Zemen 02/19/2024
License Type: MIT
*/

import {NpmVersionIncrement, Pipeline, NpmVersionTransform} from "#project";


export function executePipeline(versionIncrement: NpmVersionIncrement) {
  Pipeline
    .options({name: versionIncrement as string, logDepth: 0})
    .transform(NpmVersionTransform, versionIncrement)
    .execute();
}
