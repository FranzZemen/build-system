/*
Created by Franz Zemen 02/19/2024
License Type: MIT
*/

import {Pipeline, PipelineOptions, NpmVersionTransform, NpmVersionIncrement, Package} from "#project";




const pipelineOptions: PipelineOptions = {
  name: 'build',
  logDepth: 0
}

const buildPipeline = Pipeline
  .options({name: 'build', logDepth: 0})
  .transform(NpmVersionTransform, 'patch')
  .execute();
