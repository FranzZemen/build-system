#!/usr/bin/env node

/*
Created by Franz Zemen 02/23/2024
License Type: 
*/

import {buildPipeline} from "../lib/pipelines/build.pipeline.js";

await buildPipeline.execute();
