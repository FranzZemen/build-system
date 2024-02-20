/*
Created by Franz Zemen 01/14/2023
License Type: MIT
*/

import * as os from 'node:os';
import {
  EmitCompilerOptions,
  ImportsNotUsedAsValues,
  InteropConstraintsCompilerOptions,
  JavascriptSupportCompilerOptions,
  LanguageAndEnvironmentCompilerOptions,
  Module,
  ModuleDetection,
  ModuleResolution,
  ModulesCompilerOptions,
  NewLine,
  OutputFormattingCompilerOptions,
  PollingWatch,
  ProjectsCompilerOptions,
  Target,
  TsConfig,
  TypeCheckingCompilerOptions,
  WatchDirectory,
  WatchFile,
  WatchOptions
} from 'tsconfig.d.ts';
import {ModuleType} from "./package.js";


export type  EnvSpecificEmitOptionKeys =
  'outDir'
  | 'outFile'
  | 'declarationDir'
  | 'removeComments'
  | 'declaration'
  | 'declarationMap'
  | 'inlineSourceMap'
  | 'inlineSources'
  | 'sourceMap';


export type  NonEnvEmitOptions = Omit<EmitCompilerOptions, EnvSpecificEmitOptionKeys>;

export type EnvEmitOptions = Pick<EmitCompilerOptions, EnvSpecificEmitOptionKeys>

export type BaseCompilerOptions =
  TypeCheckingCompilerOptions
  & JavascriptSupportCompilerOptions
  & InteropConstraintsCompilerOptions
  & NonEnvEmitOptions;

export type TargetEnvironmentCompilerOptions =
  ModulesCompilerOptions
  & LanguageAndEnvironmentCompilerOptions
  & ProjectsCompilerOptions
  & EnvEmitOptions
  & OutputFormattingCompilerOptions;

export type WellKnownTargetOptions = 'ide' | 'es3' | 'es5' | 'es6' | 'nodenext' | 'esm';

export type TargetOption = {
  nickName: WellKnownTargetOptions | string;
  target: Target; // Determines target ECMAScript
  module: Module; // Helps determine the type of module
  moduleResolution: ModuleResolution; // Helps determine how the module is resolved, as of 01/2023 modern usage is primarily for node features
  packageType: ModuleType; // Determines module loading when target is node, node16, nodenext (if set to commonjs, that's the target, if set to
  // module, becomes ESM
}

export type TargetOptions = {
  options: TargetOption[],
  'primary esm': WellKnownTargetOptions | string | undefined,
  'primary commonjs': WellKnownTargetOptions | string | undefined
}


