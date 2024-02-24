/*
Created by Franz Zemen 02/19/2024
License Type: MIT
*/

import {NpmVersionIncrement, Pipeline, NpmVersionTransform, CheckInTransform, CommitTransform, PushBranchTransform} from "#project";
import inquirer from "inquirer";
import {pushPipeline} from "../lib/pipelines/push.pipeline.js";
import {buildPipeline} from "../lib/pipelines/build.pipeline.js";


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
    .append(buildPipeline)
    .transform(CheckInTransform)
    .transform(CommitTransform, {comment: `pre-version change: ${comment}`})
    .transform(NpmVersionTransform, versionIncrement)
    .transform(CheckInTransform)
    .transform(CommitTransform, {comment: `post-version change: ${comment}`})
    .transform(PushBranchTransform)
    .execute();
}
