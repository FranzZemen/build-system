#!/usr/bin/env node

/*
Created by Franz Zemen 02/19/2024
License Type: MIT
*/

import {inspect} from "node:util";
import {analyze} from "../util/index.js";
import {Reporter} from '@franzzemen/pipeline';


const reporter = new Reporter(0);
await analyze()
  .then((analysis) =>{
    reporter.info(inspect(analysis, false, 10, true));
  })
  .catch((error) => {
    reporter.error(error);
  });
