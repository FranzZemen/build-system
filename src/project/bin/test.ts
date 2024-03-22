#!/usr/bin/env node

/*
Created by Franz Zemen 03/22/2024
License Type: MIT
*/

import {testPipeline} from "../lib/pipelines/test.pipeline.js";

await testPipeline.execute();
