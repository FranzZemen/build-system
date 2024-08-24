/*
Created by Franz Zemen 03/09/2024
License Type: MIT
*/

import {cwd} from 'node:process';
import {analyze, BuildSystemAnalysis} from '../../util/index.js';
import {confirm} from '@inquirer/prompts';
import {Reporter, Task} from '@franzzemen/pipeline';

export const checkNewProject: Task<void, boolean> = async (reporter: Reporter, rollbackSteps: string[]): Promise<boolean> => {
  reporter.warn(`***** Current directory is ${cwd()}`);
  reporter.warn(`***** Make sure this is where you want to initialize your project before proceeding`);

  reporter.info('\r\nA new project may be a git repository');
  reporter.info('\r\nA new project may not contain:');
  reporter.info('  - a package.json file');
  reporter.info('  - a tsconfig.json file');
  reporter.info('  - a tsconfig.base.json file');
  reporter.info('  - a node_modules directory');
  reporter.info('  - a project directory');
  reporter.info('\r\nA new project may contain:');
  reporter.info('  - a .gitignore file');
  reporter.info('  - a LICENSE file');
  reporter.info('  - a README.md file');
  reporter.info('\r\nAll other files and directories are ignored\r\n');


  const analysis: BuildSystemAnalysis = await analyze();
  let proceed = true;
  if (analysis.ignoreExists) {
    reporter.info('A ./.ignore file exists.  Any required entries will be appended starting with token ".\\bs.token"',
                  'task-internal');
  }
  if (analysis.licenseExists) {
    reporter.info('A ./LICENSE file exists.  A new LICENSE file will not be created (that\'s ok)');
  }
  if (analysis.readmeExists) {
    reporter.info(
      'A ./README.md file exists.  A new README.md file will not be created.  Any  documentation will be appended to a section titled "##Build System"');
  }
  if (analysis.gitInitialized) {
    reporter.info('A git repository exists.  Git will not be re-initialized (that\'s ok)', 'task-internal');
  }
  if (analysis.packageJsonExists) {
    reporter.warn('A ./package.json file exists.  Initialization will not proceed');
    proceed = false;
  }
  if (analysis.tsconfigJsonExists) {
    reporter.warn('A ./tsconfig.json file exists.  Initialization will not proceed');
    proceed = false;
  }
  if (analysis.tsconfigBaseJsonExists) {
    reporter.warn('A ./tsconfig.base.json file exists.  Initialization will not proceed');
    proceed = false;
  }
  if (analysis.nodeModulesExists) {
    reporter.warn('A ./node_modules directory exists.  Initialization will not proceed');
    proceed = false;
  }
  if (analysis.srcDirectoryExists) {
    reporter.warn('A ./src directory exists.  Initialization will not proceed');
    proceed = false;
  }


  reporter.info();
  reporter.warn(`***** Current directory is ${cwd()}`);
  reporter.warn(`***** Make sure this is where you want to initialize your project before proceeding`);
  reporter.info();

  if (proceed) {
    return confirm({message: 'Minimum requirements met to initialize a new project.  Proceed?'})
      .then(proceed => {
        if (!proceed) {
          reporter.warn('Not proceeding with new project initialization.');
        }
        return proceed
      });
  } else {
    return proceed;
  }
}




