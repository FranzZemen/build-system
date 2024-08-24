/*
Created by Franz Zemen 03/09/2024
License Type: MIT
*/

import {analyze, BuildSystemAnalysis} from "../../util/index.js";
import {cwd} from "node:process";
import {confirm} from '@inquirer/prompts';
import {TransformOut} from '@franzzemen/pipeline';

export class AnalyzeTransform extends TransformOut<BuildSystemAnalysis> {
  constructor(depth: number) {
    super(depth);
  }

  protected override async executeImplOut(rollbackSteps: string[]): Promise<BuildSystemAnalysis> {
    this.contextReporter.warn(`***** Current directory is ${cwd()}`);
    this.contextReporter.warn(`***** Make sure this is where you want to initialize your project before proceeding`);

    this.contextReporter.info('\r\nA new project may be a git repository');
    this.contextReporter.info('\r\nA new project may not contain:');
    this.contextReporter.info('  - a package.json file');
    this.contextReporter.info('  - a tsconfig.json file');
    this.contextReporter.info('  - a tsconfig.base.json file');
    this.contextReporter.info('  - a node_modules directory');
    this.contextReporter.info('  - a project directory');
    this.contextReporter.info('\r\nA new project may contain:');
    this.contextReporter.info('  - a .gitignore file');
    this.contextReporter.info('  - a LICENSE file');
    this.contextReporter.info('  - a README.md file');
    this.contextReporter.info('\r\nAll other files and directories are ignored\r\n');


    const analysis: BuildSystemAnalysis = await analyze();
    let proceed = true;
    if (analysis.ignoreExists) {
      this.contextReporter.info('A ./.ignore file exists.  Any required entries will be appended starting with token ".\\bs.token"',
               'task-internal');
    }
    if (analysis.licenseExists) {
      this.contextReporter.info('A ./LICENSE file exists.  A new LICENSE file will not be created (that\'s ok)');
    }
    if (analysis.readmeExists) {
      this.contextReporter.info(
        'A ./README.md file exists.  A new README.md file will not be created.  Any  documentation will be appended to a section titled "##Build System"');
    }
    if (analysis.gitInitialized) {
      this.contextReporter.info('A git repository exists.  Git will not be re-initialized (that\'s ok)', 'task-internal');
    }
    if (analysis.packageJsonExists) {
      this.contextReporter.warn('A ./package.json file exists.  Initialization will not proceed');
      proceed = false;
    }
    if (analysis.tsconfigJsonExists) {
      this.contextReporter.warn('A ./tsconfig.json file exists.  Initialization will not proceed');
      proceed = false;
    }
    if (analysis.tsconfigBaseJsonExists) {
      this.contextReporter.warn('A ./tsconfig.base.json file exists.  Initialization will not proceed');
      proceed = false;
    }
    if (analysis.nodeModulesExists) {
      this.contextReporter.warn('A ./node_modules directory exists.  Initialization will not proceed');
      proceed = false;
    }
    if (analysis.srcDirectoryExists) {
      this.contextReporter.warn('A ./src directory exists.  Initialization will not proceed');
      proceed = false;
    }


    this.contextReporter.info();
    this.contextReporter.warn(`***** Current directory is ${cwd()}`);
    this.contextReporter.warn(`***** Make sure this is where you want to initialize your project before proceeding`);
    this.contextReporter.info();

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
