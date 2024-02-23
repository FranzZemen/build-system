#!/usr/bin/env node

/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/

import {checkInPipeline} from "../lib/pipelines/check-in.pipeline.js";

await checkInPipeline.execute();
