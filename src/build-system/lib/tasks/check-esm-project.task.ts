/*
Created by Franz Zemen 02/18/2024
License Type: 
*/


import {Task} from "../../pipeline/task/task.js";
import {readFileAsJson} from "../../util/index.js";
import {Package, packageIsEsmPackage} from "../../validate/package.js";
import {Log} from "../../log/index.js";

export type CheckEsmProject = Task<void, void>;

export async function checkESMProject(log: Log): Promise<void> {
  const packageJSON: Package = readFileAsJson<Package>('./package.json');
  if (!packageIsEsmPackage(packageJSON)) {
    const errMsg = 'This project is not an ESM project.  Root package.json does not contain "type":"module"'
    log.error(errMsg);
    throw new Error(errMsg);
  }
}
