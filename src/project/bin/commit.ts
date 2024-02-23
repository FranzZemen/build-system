#!/usr/bin/env node

/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/

import {commitPipeline} from "../lib/pipelines/commit.pipeline.js";

await commitPipeline.execute();
