import {readFile} from "fs/promises";
import {BuildError} from "./build-error.js";
import {tIsT} from "../validate/index.js";

export async function readFileAsJson<T>(filename: string, tIsT?: tIsT<T>): Promise<T> {
  return readFile(filename, {encoding: 'utf-8'})
    .then(fileContents => {
      const t = JSON.parse(fileContents);
      if (tIsT) {
        if (tIsT(t)) {
          return t as T;
        } else {
          // This will never happen, as tIsT if based on a validator will already throw.  But might implement tIsT that doesn't throw.
          throw new BuildError(`File ${filename} does not contain a valid ${tIsT.name}`);
        }
      } else {
        return t as T;
      }
    });
}
