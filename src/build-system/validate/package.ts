/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {AsyncCheckFunction, SyncCheckFunction, ValidationSchema} from "fastest-validator";
import packageNameRegex from "package-name-regex";
import semverRegex from "semver-regex";
import {compileSync} from "./validate.js";




const basePackageJSONSchema: ValidationSchema = {
  name: {type: "string", regex: packageNameRegex},
  version: {type: "string", pattern: semverRegex()},
  description: {type: "string"}
}


const basePackageJSONCheck: SyncCheckFunction = compileSync(basePackageJSONSchema);





