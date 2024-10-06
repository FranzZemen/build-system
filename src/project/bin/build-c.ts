#!/usr/bin/env node

/*
Created by Franz Zemen 02/23/2024
License Type: 
*/

import {buildNoCleanPipeline} from "../lib/pipelines/build-no-clean.pipeline.js";

await buildNoCleanPipeline.execute();
