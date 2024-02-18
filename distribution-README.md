# Build System Runtime Documentation

## Introduction

The package should have been installed per package documentation:

```console
    npm i @franzzemen/build
```

The installation provides the following npx commands:

```console
    npx @franzzemen/build init      : Initialize the build system
    npx @franzzemen/build clean     : Clean all output files
    npx @franzzemen/build build     : Build the package
    npx @franzzemen/build patch     : Build and publish a patch release
    npx @franzzemen/build minor     : Build and publish a minor release
    npx @franzzemen/build major     : Build and publish a major release
```

## Initialize the Build System

To initialize the system run the command:

```console
    npx init
```

Initialization will create the following files in the root project directory:

- ```build-configuration.json```
- ```build-base-tsconfig.json```
- ```build-project-tsconfig.json```


Using the ```build-configuration.json``` file, the build system will attempt to:

- Create a new ```src``` directory.  It will not overwrite an existing one.   
- Create a new ```out``` directory.  It will not overwrite an existing one.

## Mapping an existing project to the build system

## Uninstalling the Build System
