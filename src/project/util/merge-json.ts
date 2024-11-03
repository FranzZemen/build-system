/*
Created by Franz Zemen 02/13/2023
License Type: 
*/

import {readFile, writeFile} from 'fs/promises';
import {merge} from './merge.js';

export function mergeJson(targetPath: string, sourcePath: string, mergedPath: string): Promise<void> {
  return readFile(targetPath, {encoding: 'utf-8'})
    .then(jsonTarget => {
      const target = JSON.parse(jsonTarget);
      return readFile(sourcePath, {encoding: 'utf-8'})
        .then(jsonSource => {
          const source = JSON.parse(jsonSource);
          const result = merge(target, source);
          return writeFile(mergedPath, JSON.stringify(result), {encoding: 'utf-8'})
            .then(() => {
              return;
            });
        });
    });
}
