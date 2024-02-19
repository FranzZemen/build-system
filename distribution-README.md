# Build System Runtime Documentation

## Introduction

The package should have been installed per package documentation:

```console
    npm i @franzzemen/build
```

The installation provides the following npx commands:

```console
    npx @franzzemen/build build-init      : Initialize the build system
    npx @franzzemen/build build-clean     : Clean all output files
    npx @franzzemen/build build-build     : Build the package
    npx @franzzemen/build build-patch     : Build and publish a patch release
    npx @franzzemen/build build-minor     : Build and publish a minor release
    npx @franzzemen/build build-major     : Build and publish a major release
```

## Scaffolding

The build system expects the following scaffolding.

Scaffolding legend:

- [brackets] indicate a directory or file that can be renamed.
- (+) denotes multiplicity
- (?) following something denotes optional or suggested
- (*) denotes the file contents has important specifics documented further down
- (G) denotes this is auto generated
- (Ref: ...) denotes a reference name for further documentation (otherwise meaningless)

```
   ─[project-root] ─┬─ package.json       (*) (Ref: Root Package)
                    ├─ tsconfig.json      (*) (Ref: Root TSConfig)
                    ├─ tsconfig.base.json (*) (Ref: Base TSConfig)
                    ├─ .git               (?)
                    ├─ .gitignore         (?)   
                    │
                    ├─ build-system-templates ─┐                          (Ref: Build System Templates)
                    │                          ├─ tsconfig.root.json      (*) (Ref: Root TSConfig Template)
                    │                          ├─ tsconfig.base.json      (*) (Ref: Base TSConfig Template)
                    │                          ├─ tsconfig.proj.json      (*) (Ref: Project TSConfig Template)
                    │                          ├─ package.root.json       (*) (Ref: Root Package Template)
                    │                          └─ dist-package.proj.json  (*) (Ref: Project Package Template)
                    │
                    ├─ node_modules (G)
                    │ 
                    ├─ src ─┬─ project  ─┐                          (Ref: Project Directory)
                    │       │            ├─ tsconfig.json           (*)     (Ref: Project TSConfig)
                    │       │            ├─ package.dist.json       (?) (*) (Ref: Distribution Package)                   
                    │       │            ├─ index.ts                (?)
                    │       │            └─ [source directories]    (+)
                    │       │           
                    │       ├─ test ─┐                              (Ref: Test Directory)
                    │       │        ├─ tsconfig.json               (*) (Ref: Test TSConfig)
                    │       │        ├─ index.ts                    (?)
                    │       │        └─ [source directories]        (+)
                    │       │            
                    │       └─ [other] (+) ─┐                       (Ref: Other subprojects)
                    │                       ├─ tsconfig.json        (*) 
                    │                       ├─ index.ts             (?)
                    │                       └─ [source directories  (+)
                    │
                    └─ out (G) ─┐                                   (Ref: Output Directory)
                                ├─ project ─┐                       (G) (Ref: Project Output)
                                │           ├─ package.json         (G) (Ref: Distribution Package)
                                │           └─ [output directories] (+)
                                │     
                                ├─ test                             (G) (Ref: Test Output)
                                └─ other                            (+) (Ref: Other Output) 
                      
```

### Build System Templates

If the build system is initialized through the "init" command, it will create the build-system-templates directory and
populate it.

### Project Directory

The main project source is located src/project, where either "project"  of the project is the name of the project
directory.

### Test Directory

The test source is located here. This is test source for the project and other sub-projects.

### Other subproject directories

Sometimes it may be desirable to non-published, other sub-projects. The build system supports as many as desired.

### Root Package

The root package sets the following important package properties

- type: The package type should be set to "module". It can be set to "commonjs" but that would require all tsconfig.json
  and subproject package files to have consistent properties. It is recommended to use the esm default format, and
  leverage .cjs/.cts files for commonjs as needed.
- version:  This is the overall package version. It is incremented by the build system on actions patch, minor and
  major. The build system only understands a straightforward numeric patch, minor and major version, even though semver
  allows for other formats. The build system is not compatible with all semver version formats.
- imports:  This sets overall package imports. This is critical for dependencies, for example test source depends on
  project source located at a different root. Note that this creates a dependency on NodeNext or Node16 module
  resolution.
- exports:  Actually, the build system does not specify that an exports clause exist in the root package. That is up to
  the author.

### Root Package Template

The root package template, located in the build-system-templates directory, is a template for the root package.json
file.

#### "version"="0.0.1"

For new projects, set the version to 0.0.1. The build system will increment the version on each patch, minor or major
publish.

#### "type"="module"

The type should be set to "module". The type can be changed to "commonjs", but that will require careful changes to all
tsconfig.json and subproject package files. It is recommended instead to use .cts/.cjs files for commonjs. Dual
packaging is not supported by the build system, though it can be extended to be. The imports property provides an import
clause, so that a require clause could also be added. Other changes would have to be made to enable dual-packaging,
depending on the technique used.

#### imports

Imports definition should be added, at the very least for test files to leverage the project files.

For each 'project', including "project", an imports clause should be added, to allow for test files leverage the
project.
Note that the imports refer to the actual output, not the .ts files. The build system ensures that the output is
available
to the system so that test files transpile correctly.

Most packages will only have have the "project" and "test" subprojects

```json
{
  "version": "0.0.1",
  "type": "module",
  "imports": {
    "#project": {
      "import": {
        "types": "./out/project/types/index.d.ts",
        "default": "./out/project/index.js"
      }
    },
    "#other": {
      "import": {
        "types": "./out/other/types/index.d.ts",
        "default": "./out/other/index.js"
      }
    }
  }
}
```

### Root TSConfig

The root tsconfig.json is setup as a project based tsconfig. An entry should be made for each subproject, pointing to
the transpilation settings for that subproject.

### Root TSConfig Template

The root tsconfig template, located in the build-system-templates directory, is a template for the root tsconfig.json.

```json
{
  "files": [],
  "include": [],
  "references": [
    {
      "path": "./src/project/tsconfig.json",
      "path": "./src/test/tsconfig.json"
    }
  ]
}
```

### Base TSConfig

The base-tsconfig.json file contains base compilerOptions that are common to all subprojects, but that can be overridden
by subprojects as necessary. The build system does not enforce any particular compilation option at this level.

### Base TSConfig Template

This will be updated from time to time, to match new settings offered by Typescript.

### Project TSConfig

The tsconfig.json located in each project inherits from the root base-tsconfig.json and adds environment specific
entries.

By convention, the output is sent to "./out", with each subproject having its own output directory beneath that.

By default, the build info for incremental builds is kept in ./out/buildInfo with an entry specific to each
project.

By convention transpiled code is sent to ./out/[subproject], with types sent to ./out/[subproject]/types. For the main "
project", the subproject MUST be set to "project".

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "NodeNext",
    "target": "ESNext",
    "moduleResolution": "NodeNext",
    "tsBuildInfoFile": "../../out/buildInfo/[subproject]TsBuildInfo",
    "declarationDir": "../../out/[subproject]/types",
    "outDir": "../../out/[subproject]"
  },
  "include": [
    "**/*"
  ]
}
```





# OLD 

## Distribution Package

The distribution package is a version of the root package with fewer entries. The build system manages the coordination
of the version number. Typically, the distribution package will not have an imports clause, or at least not the same one
as the root package. If it has one, it is because the distribution javascript is leveraging imports internally (not
recommended).

When the build system publishes a patch, minor or major release, it will update the version number in the distribution
and in the root. It will also copy the distribution package to the projectg output root (./out/project) and rename it to
the expected package.json.  The author should ensure that all other settings are as desired for publishing.

## Initialize the Build System

The build system initialization will perform the following tasks. By default, the build system
does not modify existing files or directories.

The tasks will:

1. Validate the project package has ```type=module``` (use .cjs for commonjs).
2. Create a backups directory ```bs.backup``` to store originals of files that will be modified.
3. Backup original root ```tsconfig.json``` to ```bs.backup``` directory.
4. Create reference based root ```tsconfig.json``` file with default reference to "project".
3. Create ```tsconfig.json``` in the root directory.
4. Create a template project tsconfig file called ```bs.template-tsconfig.json``` in the root directory.
5. Create a new Build System Distribution Package JSON file called ```bs.distribution-package.json``` in the root
   directory.

To initialize the system run the command:

```console
    npx init
```

Initialization will create the following files in the root project directory:

- ```build-configuration.json```
- ```build-base-tsconfig.json```
- ```build-project-tsconfig.json```

Using the ```build-configuration.json``` file, the build system will attempt to:

- ```validated that the top-most package has type=module```
- Create a new ```src``` directory. It will not overwrite an existing one.
- Create a new ```out``` directory. It will not overwrite an existing one.

## Mapping an existing project to the build system

## Uninstalling the Build System
