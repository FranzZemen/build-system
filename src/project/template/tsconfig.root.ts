/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/


export const tsconfigRoot = {
  extends: './tsconfig.base.json',
  compilerOptions: {
    module: 'NodeNext',
    target: 'ESNext',
    moduleResolution: 'NodeNext',
    tsBuildInfoFile: './out/buildInfo/buildInfo',
    declarationDir: './out/project/types',
    rootDir: './src',
    outDir: './out'
  },
  include: [
    '**/*'
  ]
}
/*
export const tsconfigRoot = {
  "files": [],
  "include": [],
  "references": [
    {
      "path": "./src/project/tsconfig.json"
    },
    {
      "path": "./src/test/tsconfig.json"
    }
  ]
};
*/
