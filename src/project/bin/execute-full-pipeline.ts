/*
Created by Franz Zemen 02/19/2024
License Type: MIT
*/

import inquirer from "inquirer";
import {buildPipeline} from "../lib/pipelines/build.pipeline.js";
import {
  CheckInTransform,
  CommitTransform,
  NpmVersionIncrement,
  BuildNpmVersionTransform,
  PushBranchTransform
} from "../lib/index.js";
import {Pipeline} from "../pipeline/index.js";
import {packagePipeline} from "../lib/pipelines/package.pipeline.js";


export async function executeFullPipeline(versionIncrement: NpmVersionIncrement) {
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
    // Build
    .append(buildPipeline)
    // Check in the build
    .transform(CheckInTransform)
    // Commit prior to versioning (npm requirement)
    .transform(CommitTransform, {comment: `pre-version change: ${comment}`})
    // Execute the versioning`
    .transform(BuildNpmVersionTransform, versionIncrement)
    // Check in the version change
    .transform(CheckInTransform)
    // Commit post version change
    .transform(CommitTransform, {comment: `post-version change: ${comment}`})
    // Push to github
    .transform(PushBranchTransform)
    // Update publish package
    .append(packagePipeline)
    .execute();
}
