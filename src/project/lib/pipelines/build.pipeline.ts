/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/


import {cleanPipeline} from "./clean.pipeline.js";
import {transpilePipeline} from "./transpile.pipeline.js";
import {packagePipeline} from "./package.pipeline.js";
import {copyJsonPipeline} from "./copy-json.pipeline.js";
import {copyJsPipeline} from './copy-js.pipeline.js';
import {Pipeline} from '@franzzemen/pipeline';

export const buildPipeline = Pipeline.options({name: 'build', logDepth: 0});
buildPipeline.append(cleanPipeline);
buildPipeline.append(transpilePipeline);
buildPipeline.append(copyJsPipeline);
buildPipeline.append(packagePipeline);
buildPipeline.append(copyJsonPipeline);

