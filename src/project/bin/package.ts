#!/usr/bin/env node

/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/

import {packagePipeline} from "../lib/pipelines/package.pipeline.js";

await packagePipeline.execute();
