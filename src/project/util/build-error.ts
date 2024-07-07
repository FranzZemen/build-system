/*
Created by Franz Zemen 01/05/2023
License Type: MIT
*/

export enum BuildErrorNumber {
  UnreachableCode        = 'Error 1: Unreachable code or unexpected logic path',
  Undefined              = 'Error 2: Unexpected undefined value',

  DirectoryAlreadyExists = 'Error 50: Directory already exists',
  CopyFileError          = 'Error 51: Error copying file',
  CopyFilesError         = 'Error 52: Error copying files',
  BacktrackedDeletion    = 'Error 53: Attempt to delete backtracked file (using ../)',
  RmError                = 'Error 54: rm error',
  RmGlob                 = 'Error 55: rm glob error',
  FileAlreadyExists      = 'Error 56: File already exists',
  WriteObjectToJsonError = 'Error 57: Error writing jhson file',
  WriteStringToFile      = 'Error 58: Error writing string to file',

  // Child Process Errors
  NoExecutablePayload    = 'Error 500: No payload provided for ExecutableTransform',
  AsyncExecError         = 'Error 501: Asynchronous executable errored out',
  SyncExecError          = 'Error 502: Synchronous executable errored out',
  // Git Errors
  GitAddError            = `Error 600: Git add error`,
  // Package Errors
  PackageNotVersioned    = 'Error 1000: Package is not versioned',
  // Miscellaneous
  VersionIsNotSemver     = 'Error 5000: Version string does not represent a semver',
  // Transform errors
  MissingPayload         = 'Error 6000: Missing payload',


}

export class BuildError extends Error {

  public  constructor (message?: string, options?: ErrorOptions, public readonly errorNumber?: BuildErrorNumber) {
    super(message, options);
  }
}
