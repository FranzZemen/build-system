#!/usr/bin/env node

/*
Created by Franz Zemen 02/18/2024
License Type: MIT
*/

import {deleteSync} from 'del';
import {Log} from '../log/index.js';

const log = new Log();
log.info('Deleting ./out ...');
deleteSync('./out');
log.info('... deleted ./out');
