/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {SyncCheckFunction, ValidationSchema} from "fastest-validator";
import packageNameRegex from "package-name-regex";
import semverRegex from "semver-regex";
import {compileSync, validate} from "./validate.js";
import {Version} from "../util/semver.js";
import {Binaries, Exports, Imports, Main, ModuleType, Scripts} from "../options/index.js";
import _ from "lodash";
import {tIsT} from "./t-is-T.js";
import {BuildError} from "../util/index.js";

export type CommonPublicDomainLicenseIds = 'PD' | 'CCO';
export type CommonPermissiveLicenseIds = 'MIT' | 'Apache' | 'MPL';
export type CommonCopyLeftLicenseIds = 'GPL' | 'AGPL';
export type CommonNonCommercialLicenseIds = 'JRL' | 'AFPL';
export type Unlicensed = 'UNLICENSED' | `SEE LICENSE IN ${string}`;

export type License =
  CommonPublicDomainLicenseIds
  | CommonPermissiveLicenseIds
  | CommonCopyLeftLicenseIds
  | CommonNonCommercialLicenseIds
  | Unlicensed
  | string;  // SPDX

export type Dependencies = {
  [key: string]: string;
}

// Note, incomplete even for NPM, but we'll add as needed.
export type Package = {
  name?: string;
  description?: string;
  version?: Version;
  type?: ModuleType;
  scripts?: Scripts,
  bin?: Binaries,
  main?: Main;
  types?: `./${string}`;
  exports?: Exports;
  imports?: Imports;
  license?: License;
  author?: string;
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  [key: string]: any
}


const basePackageJSONSchema: ValidationSchema = {
  name: {type: "string", regex: packageNameRegex},
  version: {type: "string", pattern: semverRegex()},
  description: {type: "string"}
}
const basePackageCheck: SyncCheckFunction = compileSync(basePackageJSONSchema);

const esmPackageJSONSchema: ValidationSchema = _.merge({}, basePackageJSONSchema, {
  type: {type: "string", regex: "/^module$/"}
});
const esmPackageCheck: SyncCheckFunction = compileSync(esmPackageJSONSchema);

export const packageIsBasePackage: tIsT<Package> = function packageIsBasePackage(packageJSON: Package | unknown): packageJSON is Package  {
  return validate<Package>(packageJSON, basePackageCheck, 'package')
}
export const  packageIsEsmPackage: tIsT<Package> = function packageIsEsmPackage(packageJSON: Package | unknown): packageJSON is Package {
  return validate<Package>(packageJSON, esmPackageCheck, 'package');
}




