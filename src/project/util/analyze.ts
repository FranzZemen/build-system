/*
Created by Franz Zemen 02/19/2024
License Type: MIT
*/

import {git} from "./git.js";
import {access} from "fs/promises";
import {readFileAsJson} from "./read-file-as-json.js";
import {Package} from "../validate/index.js";
import {TsConfig} from "tsconfig.d.ts";

export type BuildSystemAnalysis = {
  gitInitialized?: boolean;
  remoteExists?: boolean;
  srcFolderExists?: boolean;
  projectFolderExists?: boolean;
  testFolderExists?: boolean;
  packageJsonExists?: boolean;
  packageJsonTypeModule?: boolean;
  packageJsonVersion?: boolean;
  packageJsonExpectedImports?: boolean;
  tsconfigJsonExists?: boolean;
  tsconfigJsonReferences?: boolean;
  tsconfigJsonProjectReference?: boolean;
  tsconfigJsonTestReference?: boolean;
  tsconfigBaseJsonExists?: boolean;
  tsconfigProjectExists?: boolean;
  tsconfigProjectExtendsBase?: boolean;
  tsconfigProjectModule?: boolean;
  tsconfigProjectOutput?: boolean;
  tsconfigProjectBuildInfo?: boolean;
  tsconfigProjectTypes?: boolean;
  tsconfigTestExists?: boolean;
  tsconfigTestExtendsBase?: boolean;
  tsconfigTestModule?: boolean;
  tsconfigTestOutput?: boolean;
  tsconfigTestBuildInfo?: boolean;
  tsconfigTestTypes?: boolean;
  packageDistJsonExists?: boolean;
  packageDistJsonBin?: boolean;
  packageDistJsonBasicInfo?: boolean;
};

export async function analyze(): Promise<BuildSystemAnalysis> {
  const buildSystemAnalysis: BuildSystemAnalysis = {};
  // Check if git is initialized (root repo)
  buildSystemAnalysis.gitInitialized = await git().checkIsRepo();
  // Check that an origin remote exists
  if(buildSystemAnalysis.gitInitialized) {
    buildSystemAnalysis.remoteExists = (await git().getRemotes()).includes('origin');
  } else {
    buildSystemAnalysis.remoteExists = false;
  }
  // Check if the src folder exists
  await access('./src')
    .then(() => buildSystemAnalysis.srcFolderExists = true)
    .catch(() => buildSystemAnalysis.srcFolderExists = false);
  // Check if the project folder exists
  await access('./src/project')
    .then(() => buildSystemAnalysis.projectFolderExists = true)
    .catch(() => buildSystemAnalysis.projectFolderExists = false);
  // Check if the test folder exists
  await access('./src/test')
    .then(() => buildSystemAnalysis.testFolderExists = true)
    .catch(() => buildSystemAnalysis.testFolderExists = false);
  // Check if package.json exists
  await access('./package.json')
    .then(() => buildSystemAnalysis.packageJsonExists = true)
    .catch(() => buildSystemAnalysis.packageJsonExists = false);
  let rootPackage: Package = {};
  if(!buildSystemAnalysis.packageJsonExists) {
    rootPackage = await readFileAsJson<Package>('./package.json')
      .then(rootPackage => {
        // --> Check if type=module is set
        buildSystemAnalysis.packageJsonTypeModule = rootPackage.type === 'module';
        // --> Check if version is set
        buildSystemAnalysis.packageJsonVersion = rootPackage.version !== undefined;
        // --> Check if expected imports are set
        const imports: any = rootPackage.imports;
        const project: any = imports?.['#project'];
        const importEntry: any = project ? project['import'] : undefined;
        const typesEntry: string = importEntry ? importEntry.types : undefined;
        const defaultEntry: string = importEntry ? importEntry.default : undefined;
        buildSystemAnalysis.packageJsonExpectedImports =
          typesEntry !== undefined
          && defaultEntry !== undefined
          && typesEntry === './out/project/types'
          && defaultEntry === './out/project/index.js';
        return rootPackage
      });
  } else {
    buildSystemAnalysis.packageJsonTypeModule = false;
    buildSystemAnalysis.packageJsonVersion = false;
    buildSystemAnalysis.packageJsonExpectedImports = false;
  }
  // Check if tsconfig.json exists
  await access('./tsconfig.json')
    .then(() => buildSystemAnalysis.tsconfigJsonExists = true)
    .catch(() => buildSystemAnalysis.tsconfigJsonExists = false);
  if(buildSystemAnalysis.tsconfigJsonExists) {
    const tsconfig = await readFileAsJson<any>('./tsconfig.json');
    // --> Check that it uses references
    buildSystemAnalysis.tsconfigJsonReferences = tsconfig.references !== undefined;
    // --> Check that it has a project reference
    const projectReference = tsconfig.references?.find((reference: any) => reference.path === './src/project/tsconfig.json');
    buildSystemAnalysis.tsconfigJsonProjectReference = projectReference !== undefined;
    // --> Check that it has a test reference
    const testReference = tsconfig.references?.find((reference: any) => reference.path === './src/test/tsconfig.json');
    buildSystemAnalysis.tsconfigJsonTestReference = testReference !== undefined;
  } else {
    buildSystemAnalysis.tsconfigJsonReferences = false;
    buildSystemAnalysis.tsconfigJsonProjectReference = false;
    buildSystemAnalysis.tsconfigJsonTestReference = false;
  }
  // Check that ./tsconfig.base.json exists
  await access('./tsconfig.base.json')
    .then(() => buildSystemAnalysis.tsconfigBaseJsonExists = true)
    .catch(() => buildSystemAnalysis.tsconfigBaseJsonExists = false);
  // Check that ./src/project/tsconfig.json exists
  await access('./src/project/tsconfig.json')
    .then(() => buildSystemAnalysis.tsconfigProjectExists = true)
    .catch(() => buildSystemAnalysis.tsconfigProjectExists = false);
  if(buildSystemAnalysis.tsconfigProjectExists) {
    const tsconfig = await readFileAsJson<TsConfig>('./src/project/tsconfig.json');
    // --> Check that it extends ./tsconfig.base.json
    buildSystemAnalysis.tsconfigProjectExtendsBase = tsconfig.extends === './tsconfig.base.json';
    // --> Check that it uses module=NodeNext or Node16
    if(tsconfig.compilerOptions?.moduleResolution !== undefined) {
      buildSystemAnalysis.tsconfigProjectModule = tsconfig.compilerOptions.moduleResolution.toLocaleLowerCase() === 'nodenext' || tsconfig.compilerOptions.moduleResolution.toLocaleLowerCase() === 'node16';
    } else {
      buildSystemAnalysis.tsconfigProjectModule = false;
    }
    // --> Check that it outputs to ./out/project
    buildSystemAnalysis.tsconfigProjectOutput = tsconfig.compilerOptions?.outDir === './out/project';
    // --> Check that it has build info entry
    buildSystemAnalysis.tsconfigProjectBuildInfo = tsconfig.compilerOptions?.tsBuildInfoFile !== undefined && tsconfig.compilerOptions.tsBuildInfoFile.startsWith('./out');
    // --> Check that it has a types entry somewhere under ./out/project
    buildSystemAnalysis.tsconfigProjectTypes = tsconfig.compilerOptions?.types !== undefined && tsconfig.compilerOptions.types.includes('./out/project/types');
  }
  // Check that ./src/test/tsconfig.json exists
  await access('./src/test/tsconfig.json')
    .then(() => buildSystemAnalysis.tsconfigTestExists = true)
    .catch(() => buildSystemAnalysis.tsconfigTestExists = false);
  if(buildSystemAnalysis.tsconfigTestExists) {
    const tsconfig = await readFileAsJson<TsConfig>('./src/test/tsconfig.json');
    // --> Check that it extends ./tsconfig.base.json
    buildSystemAnalysis.tsconfigTestExtendsBase = tsconfig.extends === './tsconfig.base.json';
    // --> Check that it uses module=NodeNext or Node16
    if(tsconfig.compilerOptions?.moduleResolution !== undefined) {
      buildSystemAnalysis.tsconfigTestModule = tsconfig.compilerOptions.moduleResolution.toLocaleLowerCase() === 'nodenext' || tsconfig.compilerOptions.moduleResolution.toLocaleLowerCase() === 'node16';
    } else {
      buildSystemAnalysis.tsconfigTestModule = false;
    }
    // --> Check that it outputs to ./out/test
    buildSystemAnalysis.tsconfigTestOutput = tsconfig.compilerOptions?.outDir === './out/test';
    // --> Check that it has build info entry
    buildSystemAnalysis.tsconfigTestBuildInfo = tsconfig.compilerOptions?.tsBuildInfoFile !== undefined && tsconfig.compilerOptions.tsBuildInfoFile.startsWith('./out');
    // --> Check that it has a types entry somewhere under ./out/test
    buildSystemAnalysis.tsconfigTestTypes = tsconfig.compilerOptions?.types !== undefined && tsconfig.compilerOptions.types.includes('./out/test/types');
    // Check that ./src/test/package.dist.json exists
    await access('./src/test/package.dist.json')
      .then(() => buildSystemAnalysis.packageDistJsonExists = true)
      .catch(() => buildSystemAnalysis.packageDistJsonExists = false);
    // --> Check that the bin entries exist
    let distPackage: Package = {}
    if(buildSystemAnalysis.packageDistJsonExists) {
      distPackage = await readFileAsJson<Package>('./src/test/package.dist.json');
    }
      /*
      if(distPackage.bin && distPackage.bin['build'] && distPackage.bin['patch'] && distPackage.bin['minor'] && distPackage.bin['major']) {
        buildSystemAnalysis.packageDistJsonBin = true;
      }
    } else {
      buildSystemAnalysis.packageDistJsonBin = false;
    }*/
    // --> Check that basic info matches root package.json
    if(buildSystemAnalysis.packageJsonExists && buildSystemAnalysis.packageDistJsonExists) {
      buildSystemAnalysis.packageDistJsonBasicInfo = distPackage.name === rootPackage.name
        && distPackage.version === rootPackage.version
        && distPackage.description === rootPackage.description;
    } else {
      buildSystemAnalysis.packageDistJsonBasicInfo = false;
    }
  }
  return buildSystemAnalysis;
}

