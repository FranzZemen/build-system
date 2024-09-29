/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/

import {ReadJsonToPackageTransform} from '../transforms/read-json-to-package.transform.js';
import {Package, packageIsEsmPackage} from '../../validate/index.js';
import {MaleateObjectTransform} from '../transforms/maleate-object.transform.js';
import {WriteObjectToJsonTransform} from '../transforms/write-object-to-json.transform.js';
import {Pipeline} from '@franzzemen/pipeline';

export const packagePipeline = Pipeline
  .options({name: 'packagePipeline', logDepth: 0})
  .transform(ReadJsonToPackageTransform, {targetPath: './package.json', tIsT: packageIsEsmPackage} as const)
  .transform(MaleateObjectTransform<Package>, {
    merge: {
      exports: {
        '.': {
          types: './types/index.d.ts',
          import: './index.js'
        }
      }
    }, mergeIf: [{
      if: 'exists',
      ifPath: ['exports', './server'],
      merge: {
        exports: {
          './server': {
            types: './types/server-index.d.ts',
            import: './server-index.js'
          }
        }
      }
    },{
      if: 'exists',
      ifPath: ['imports', "#test"],
      merge: {
        imports: {}
      }
    }]
  })
  // Write the package for publication
  .transform(WriteObjectToJsonTransform, {targetPath: './out/project/package.json'} as const)
  // Testing package.json
  .transform(MaleateObjectTransform<Package>, {
    merge: {
      exports: {
        '.': {
          types: './project/types/index.d.ts',
          import: './project/index.js'
        }
      }
    },
    mergeIf: [{
      if: 'exists',
      ifPath: ['exports', './server'],
      merge: {
        exports: {
          './server': {
            types: './project/types/server-index.d.ts',
            import: './project/server-index.js'
          }
        }
      }
    },{
      if: 'exists',
      ifPath: ['imports', "#test"],
      merge: {
        imports: {
          '#test': {
            types: './project/types/test-index.d.ts',
            import: './project/test-index.js'
          }
        }
      }
    }]
  })
  // Write the package for testing
  .transform(WriteObjectToJsonTransform, {targetPath: './out/package.json'} as const)

