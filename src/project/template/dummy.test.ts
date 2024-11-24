/*
Created by Franz Zemen 11/24/2024
License Type: UNLICENSED
*/

export const dummyTestTs =
`import 'mocha';
import * as chai from 'chai';
// Uncomment me!  import {something} from '@franzzemen/[package]';

const expect = chai.expect;
const should = chai.should();

describe('[package] tests', () => {
  describe('[module] tests', () => {
    describe('[series] tests', () => {
      it('should be a sample', () => {
        expect(true).to.be.true;
      });
    });
  });
});`
