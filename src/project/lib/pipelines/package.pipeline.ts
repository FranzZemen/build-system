/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/

import {Pipeline} from "../../pipeline/index.js";
import {ReadJsonToPackageTransform} from "../transforms/read-json-to-package.transform.js";
import {Package, packageIsEsmPackage} from "../../validate/index.js";
import {MaleatePackageTransform} from "../transforms/maleate-package.transform.js";
import {MaleateObjectTransform} from "../transforms/maleate-object.transform.js";
import {WriteObjectToJsonTransform} from "../transforms/write-object-to-json.transform.js";

export const packagePipeline = Pipeline
  .options({name: 'packagePipeline', logDepth: 0})
  .transform(ReadJsonToPackageTransform, {targetPath: './package.json', tIsT: packageIsEsmPackage} as const)
  .transform(MaleateObjectTransform<Package>, {merge: {
      exports: {
        '.': {
          types: './out/project/types/index.d.ts',
          import: './out/project/index.js'
        }
      },
    }} as const)
  .transform(WriteObjectToJsonTransform, {targetPath: './out/project/package.json'} as const);

