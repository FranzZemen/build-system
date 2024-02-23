/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/


import {Pipeline} from "../../pipeline/index.js";
import {cleanPipeline} from "./clean.pipeline.js";
import {transpilePipeline} from "./transpile.pipeline.js";
import {packagePipeline} from "./package.pipeline.js";

export const buildPipeline = Pipeline.options({name: 'build', logDepth: 0});
buildPipeline.append(cleanPipeline);
buildPipeline.append(transpilePipeline);
buildPipeline.append(packagePipeline);

