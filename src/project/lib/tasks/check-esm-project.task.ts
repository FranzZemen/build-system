/*
Created by Franz Zemen 02/18/2024
License Type: 
*/


import {readFileAsJson} from '../../util/index.js';
import {Package, packageIsEsmPackage} from '../../validate/package.js';
import {Reporter, Task} from '@franzzemen/pipeline';

export type CheckEsmProjectTask = Task<void, void>;

export async function checkESMProject(reporter: Reporter, rollbackSteps: string[]): Promise<void> {
  return readFileAsJson<Package>('./package.json', packageIsEsmPackage).then(packageJSON => {
  });
}
