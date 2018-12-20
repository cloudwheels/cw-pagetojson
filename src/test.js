/* eslint-disable max-len */
'use strict';
import * as tabletojson from './tabletojson';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const html = fs.readFileSync(path.resolve(__dirname, 'tables.html'), {encoding: 'UTF-8'});
const res = tabletojson.convert(html);
console.log('res', res);
