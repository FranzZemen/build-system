/*
Created by Franz Zemen 02/22/2024
License Type: 
*/

import {Pipeline} from "../../pipeline/index.js";
import {CleanTransform} from "../transforms/clean.transform.js";



export const cleanPipeline = Pipeline
  .options({name: 'clean', logDepth: 0})
  .transform(CleanTransform);
