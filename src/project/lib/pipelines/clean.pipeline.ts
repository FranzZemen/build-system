/*
Created by Franz Zemen 02/22/2024
License Type: 
*/

import {CleanTransform} from "../transforms/clean.transform.js";
import {Pipeline} from '@franzzemen/pipeline';



export const cleanPipeline = Pipeline
  .options({name: 'clean', logDepth: 0})
  .transform(CleanTransform);
