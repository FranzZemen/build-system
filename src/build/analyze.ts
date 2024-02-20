/*
Created by Franz Zemen 02/19/2024
License Type: MIT
*/

import {analyze, Log} from "#project";
import {inspect} from "node:util";

await analyze()
  .then((analysis) =>{
    const log = new Log(0);
    log.info(inspect(analysis, false, 10, true));
  });
