#!/usr/bin/env node

/*
Created by Franz Zemen 02/19/2024
License Type: MIT
*/

import {inspect} from "node:util";
import {analyze} from "../util/index.js";
import {Log} from "../log/index.js";

const log = new Log(0);
await analyze()
  .then((analysis) =>{
    log.info(inspect(analysis, false, 10, true));
  })
  .catch((error) => {
    log.error(error);
  });
