/*
Created by Franz Zemen 02/19/2024
License Type: MIT
*/

import {inspect} from "node:util";
import {analyze} from "../util/index.js";
import {Log} from "../log/index.js";

await analyze()
  .then((analysis) =>{
    const log = new Log(0);
    log.info(inspect(analysis, false, 10, true));
  });
