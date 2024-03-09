/*
Created by Franz Zemen 03/09/2024
License Type: MIT
*/

import {cwd} from "node:process";
import {Task} from "../../pipeline/index.js";
import {Log} from "../../log/index.js";
import {analyze, BuildSystemAnalysis} from "../../util/index.js";
import inquirer from 'inquirer'

export const checkNewProject: Task<void, boolean> = async (log: Log, rollbackSteps: string[]): Promise<boolean> => {
  log.warn(`***** Current directory is ${cwd()}`);
  log.warn(`***** Make sure this is where you want to initialize your project before proceeding`);

  log.info('\r\nA new project may be a git repository');
  log.info('\r\nA new project may not contain:');
  log.info('  - a package.json file');
  log.info('  - a tsconfig.json file');
  log.info('  - a tsconfig.base.json file');
  log.info('  - a node_modules directory');
  log.info('  - a project directory');
  log.info('\r\nA new project may contain:');
  log.info('  - a .gitignore file');
  log.info('  - a LICENSE file');
  log.info('  - a README.md file');
  log.info('\r\nAll other files and directories are ignored\r\n');


  const analysis: BuildSystemAnalysis = await analyze();
  let proceed = true;
  if (analysis.ignoreExists) {
    log.info('A ./.ignore file exists.  Any required entries will be appended starting with token ".\\bs.token"',
             'task-internal');
  }
  if (analysis.licenseExists) {
    log.info('A ./LICENSE file exists.  A new LICENSE file will not be created (that\'s ok)');
  }
  if (analysis.readmeExists) {
    log.info(
      'A ./README.md file exists.  A new README.md file will not be created.  Any  documentation will be appended to a section titled "##Build System"');
  }
  if (analysis.gitInitialized) {
    log.info('A git repository exists.  Git will not be re-initialized (that\'s ok)', 'task-internal');
  }
  if (analysis.packageJsonExists) {
    log.warn('A ./package.json file exists.  Initialization will not proceed');
    proceed = false;
  }
  if (analysis.tsconfigJsonExists) {
    log.warn('A ./tsconfig.json file exists.  Initialization will not proceed');
    proceed = false;
  }
  if (analysis.tsconfigBaseJsonExists) {
    log.warn('A ./tsconfig.base.json file exists.  Initialization will not proceed');
    proceed = false;
  }
  if (analysis.nodeModulesExists) {
    log.warn('A ./node_modules directory exists.  Initialization will not proceed');
    proceed = false;
  }
  if (analysis.srcDirectoryExists) {
    log.warn('A ./src directory exists.  Initialization will not proceed');
    proceed = false;
  }


  log.info();
  log.warn(`***** Current directory is ${cwd()}`);
  log.warn(`***** Make sure this is where you want to initialize your project before proceeding`);
  log.info();

  if(proceed) {
    return inquirer.prompt([
                             {
                               name: 'proceed',
                               message: 'Minimum requirements met to initialize a new project.  Proceed?',
                               type: 'confirm',
                               default: false
                             }
                           ])
      .then(answers => {
        proceed = answers['proceed'];
        if (!proceed) {
          log.warn('Not proceeding with new project initialization.');
        }
        return proceed
      });
  } else {
    return proceed;
  }
}




