/*
Created by Franz Zemen 02/22/2024
License Type: MIT
*/

import {Reporter} from '@franzzemen/pipeline';

function getPackageConfig() {
  const reporter:Reporter = new Reporter();
  reporter.info('Getting package.json ...\n');
  reporter.info(`merge the following into your top-level package.json.  Place the "build-system" key in the root of the package.json file.`);
}
