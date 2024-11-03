/*
Created by Franz Zemen 11/03/2024
License Type: UNLICENSED
*/


import mergeWith from 'lodash.mergewith';


function customizer(objValue:any, srcValue:any) {
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    return objValue.concat(srcValue);
  }
  return undefined;
}
export function merge(dest:any, ...src:any[]):any {
  if(Array.isArray(src)) {
    return mergeWith(dest, ...src, customizer);
  } else {
    return mergeWith(dest, src, customizer);
  }
}
