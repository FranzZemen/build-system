
export const tsConfigProject = {
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "NodeNext",
    "target": "ESNext",
    "moduleResolution": "NodeNext",
    "tsBuildInfoFile": "../../out/buildInfo/projectTsInfo",
    "declarationDir": "../../out/project/types",
    "outDir": "../../out/project"
  },
 "include": ["**/*"]
}
