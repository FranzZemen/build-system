#!/usr/bin/env node

/*
Created by Franz Zemen 03/22/2024
License Type: MIT
*/

import {testOnlyPipeline} from '../lib/pipelines/test.pipeline.js';

await testOnlyPipeline.execute();
