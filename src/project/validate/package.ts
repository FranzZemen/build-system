/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {SyncCheckFunction, ValidationSchema} from "fastest-validator";

import semverRegex from "semver-regex";
import {compileSync, validate} from "./validate.js";
import {Version} from "../util/semver.js";
import {tIsT} from "./t-is-T.js";
import {packageNameRegex} from 'package-name-regex';
import {merge} from '../util/merge.js';


export type ConditionalExportKeys =
  'require'
  | 'import'
  | 'node'
  | 'node-addons'
  | 'default'
  | 'types'
  | 'browser'
  | 'react-native'
  | 'development'
  | 'production'
  | 'deno';

export type PackageSubPath = '.' | `./${string}`;
export type ConditionalExports = { [key in ConditionalExportKeys]?: PackageSubPath};
export type ConditionalSubPathExports = {
  [key in PackageSubPath]?: {
    [key in ConditionalExportKeys]?: PackageSubPath | ConditionalExports
  };
};
export type Exports = PackageSubPath | ConditionalExports | ConditionalSubPathExports;

export type ImportsKey = `#${string}`;
export type ImportsSubPath = `./${string}` | string | ConditionalExportKeys;
export type ConditionalSubPathImports = {[key: ImportsKey]: { [key in ConditionalExportKeys]?: ImportsSubPath | ConditionalExports }};
export type Imports = { [key: ImportsKey]: ImportsSubPath } | ConditionalSubPathImports;

export type Main = PackageSubPath;

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


export enum ModuleType {
  module   = 'module',
  commonjs = 'commonjs'
}

export type Script = string;

export type Scripts = {
  [key: string]: Script
}

export type Binary = string;

export type Binaries = {
  [key: string]: Binary
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

const esmPackageJSONSchema: ValidationSchema = merge({}, basePackageJSONSchema);
esmPackageJSONSchema['type'] = {type: "string", pattern: "/^module$/"};


const esmPackageCheck: SyncCheckFunction = compileSync(esmPackageJSONSchema);

export const packageIsBasePackage: tIsT<Package> = function packageIsBasePackage(packageJSON: Package | unknown, throwIfNot = true): packageJSON is Package  {
  const result =  validate<Package>(packageJSON, basePackageCheck, 'package', throwIfNot)
  if(typeof result === 'boolean') {
    return result;
  } else {
    return false;
  }
}
export const  packageIsEsmPackage: tIsT<Package> = function packageIsEsmPackage(packageJSON: Package | unknown, throwIfNot = true): packageJSON is Package {
  const result = validate<Package>(packageJSON, esmPackageCheck, 'package', throwIfNot);
  if(typeof result === 'boolean') {
    return result;
  } else {
    return false;
  }
}




