/*
Created by Franz Zemen 02/23/2024
License Type: MIT
*/


import {ReadObjectTransform} from "./read-object.transform.js";
import {Package} from "../../validate/index.js";

export class ReadJsonToPackageTransform extends ReadObjectTransform<Package> {
  constructor(depth: number) {
    super(depth);
  }
}
