#!/usr/bin/env node

/*
Created by Franz Zemen 02/23/2024
License Type: 
*/

import {buildOnlyPipeline} from "../lib/pipelines/build-only.pipeline.js";

await buildOnlyPipeline.execute();
