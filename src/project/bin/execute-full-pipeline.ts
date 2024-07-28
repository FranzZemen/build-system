/*
Created by Franz Zemen 02/19/2024
License Type: MIT
*/


import {
  CheckInTransform,
  CommitTransform, NpmPublishTransform,
  NpmVersionIncrement,
  NpmVersionTransform,
  PushBranchTransform
} from "../lib/index.js";
import {Pipeline} from "../pipeline/index.js";
import {packagePipeline} from "../lib/pipelines/package.pipeline.js";
import {testPipeline} from "../lib/pipelines/test.pipeline.js";
import {input} from '@inquirer/prompts';


export async function executeFullPipeline(versionIncrement: NpmVersionIncrement, comment?: string) {
  if(!comment) {
    comment = await input({message: 'Commit comment'});
  }

  await Pipeline
    .options({name: versionIncrement as string, logDepth: 0})
    // Build
    .append(testPipeline)
    // Check in the build
    .transform(CheckInTransform)
    // Commit prior to versioning (npm requirement)
    .transform(CommitTransform, {comment: `pre-version change: ${comment}`})
    // Execute the versioning`
    .transform(NpmVersionTransform, versionIncrement)
    // Check in the version change
    .transform(CheckInTransform)
    // Commit post version change
    .transform(CommitTransform, {comment: `post-version change: ${comment}`})
    // Push to github
    .transform(PushBranchTransform)
    // Update publish package
    .append(packagePipeline)
    .transform(NpmPublishTransform)
    .execute();
}
