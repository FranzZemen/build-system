/*
Created by Franz Zemen 02/19/2024
License Type: MIT
*/

import {NpmVersionIncrement, Pipeline, NpmVersionTransform, CheckInTransform, CommitTransform, PushBranchTransform} from "#project";
import inquirer from "inquirer";


export async function executeFulllPipeline(versionIncrement: NpmVersionIncrement) {
  const comment = await inquirer
    .prompt([
              {
                name: 'comment',
                message: 'Commit comment',
                type: 'input',
                default: ''
              }
            ])
    .then(answers => {
      return answers['comment'];
    });
  await Pipeline
    .options({name: versionIncrement as string, logDepth: 0})
    .transform(CheckInTransform)
    .transform(CommitTransform, {comment: `pre-version change: ${comment}`})
    .transform(NpmVersionTransform, versionIncrement)
    .transform(CheckInTransform)
    .transform(CommitTransform, {comment: `post-version change: ${comment}`})
    .transform(PushBranchTransform)
    .execute();
}
