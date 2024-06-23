/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

export const tsConfigTest = {
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "NodeNext",
    "target": "ESNext",
    "moduleResolution": "NodeNext",
    "tsBuildInfoFile": "../../out/buildInfo/testTsInfo",
    "declarationDir": "../../out/test/types",
    "outDir": "../../out/test"
  },
  "include": ["**/*"]
}
