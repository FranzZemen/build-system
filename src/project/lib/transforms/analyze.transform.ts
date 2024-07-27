/*
Created by Franz Zemen 03/09/2024
License Type: MIT
*/

import {TransformOut} from "../../pipeline/index.js";
import {analyze, BuildSystemAnalysis} from "../../util/index.js";
import {cwd} from "node:process";
import {confirm} from '@inquirer/prompts';

export class AnalyzeTransform extends TransformOut<BuildSystemAnalysis> {
  constructor(depth: number) {
    super(depth);
  }

  protected override async executeImplOut(rollbackSteps: string[]): Promise<BuildSystemAnalysis> {
    this.contextLog.warn(`***** Current directory is ${cwd()}`);
    this.contextLog.warn(`***** Make sure this is where you want to initialize your project before proceeding`);

    this.contextLog.info('\r\nA new project may be a git repository');
    this.contextLog.info('\r\nA new project may not contain:');
    this.contextLog.info('  - a package.json file');
    this.contextLog.info('  - a tsconfig.json file');
    this.contextLog.info('  - a tsconfig.base.json file');
    this.contextLog.info('  - a node_modules directory');
    this.contextLog.info('  - a project directory');
    this.contextLog.info('\r\nA new project may contain:');
    this.contextLog.info('  - a .gitignore file');
    this.contextLog.info('  - a LICENSE file');
    this.contextLog.info('  - a README.md file');
    this.contextLog.info('\r\nAll other files and directories are ignored\r\n');


    const analysis: BuildSystemAnalysis = await analyze();
    let proceed = true;
    if (analysis.ignoreExists) {
      this.contextLog.info('A ./.ignore file exists.  Any required entries will be appended starting with token ".\\bs.token"',
               'task-internal');
    }
    if (analysis.licenseExists) {
      this.contextLog.info('A ./LICENSE file exists.  A new LICENSE file will not be created (that\'s ok)');
    }
    if (analysis.readmeExists) {
      this.contextLog.info(
        'A ./README.md file exists.  A new README.md file will not be created.  Any  documentation will be appended to a section titled "##Build System"');
    }
    if (analysis.gitInitialized) {
      this.contextLog.info('A git repository exists.  Git will not be re-initialized (that\'s ok)', 'task-internal');
    }
    if (analysis.packageJsonExists) {
      this.contextLog.warn('A ./package.json file exists.  Initialization will not proceed');
      proceed = false;
    }
    if (analysis.tsconfigJsonExists) {
      this.contextLog.warn('A ./tsconfig.json file exists.  Initialization will not proceed');
      proceed = false;
    }
    if (analysis.tsconfigBaseJsonExists) {
      this.contextLog.warn('A ./tsconfig.base.json file exists.  Initialization will not proceed');
      proceed = false;
    }
    if (analysis.nodeModulesExists) {
      this.contextLog.warn('A ./node_modules directory exists.  Initialization will not proceed');
      proceed = false;
    }
    if (analysis.srcDirectoryExists) {
      this.contextLog.warn('A ./src directory exists.  Initialization will not proceed');
      proceed = false;
    }


    this.contextLog.info();
    this.contextLog.warn(`***** Current directory is ${cwd()}`);
    this.contextLog.warn(`***** Make sure this is where you want to initialize your project before proceeding`);
    this.contextLog.info();

    if(proceed) {
      return confirm({message: 'Minimum requirements met to initialize a new project.  Proceed?'})
        .then(confirmed => {
          if(confirmed) {
            return analysis;
          } else {
            throw new Error('Initialization will not proceed at user\'s request');
          }
        });
    } else {
      throw new Error('Initialization will not proceed');
    }
  }

  protected override transformContext(pipeIn?: undefined, payload?: undefined): string | object {
    return 'Analyzing';
  }

}
