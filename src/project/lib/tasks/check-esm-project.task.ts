/*
Created by Franz Zemen 02/18/2024
License Type: 
*/


import {Task} from "../../pipeline/task/task.js";
import {BuildError, readFileAsJson} from "../../util/index.js";
import {Package, packageIsEsmPackage} from "../../validate/package.js";
import {Log} from "../../log/index.js";
import {cwd} from "node:process";

export type CheckEsmProjectTask = Task<void, void>;

export async function checkESMProject(log: Log, rollbackSteps: string[]): Promise<void> {
  return readFileAsJson<Package>('./package.json', packageIsEsmPackage).then(packageJSON => {});
}
