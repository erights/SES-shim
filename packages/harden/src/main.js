/* global harden SES */
// Adapted from SES/Caja - Copyright (C) 2011 Google Inc.
// Copyright (C) 2018 Agoric

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// eslint-disable-next-line import/no-unresolved
import makeHardener from '@agoric/make-hardener';
import buildTable from './buildTable.js';

// Try to use SES's own harden if available.
let h = typeof harden !== 'undefined' && harden;
if (!h) {
  // Legacy SES compatibility.
  h = typeof SES !== 'undefined' && SES.harden;
}

if (!h) {
  console.warn(`SecurityWarning: '@agoric/harden' is ineffective without SES`);

  // Hunt down our globals.
  // eslint-disable-next-line no-new-func
  const g = Function('return this')();

  // this use of 'global' is why Harden is a "resource module", whereas
  // MakeHardener is "pure".
  const initialRoots = buildTable(g);
  // console.log('initialRoots are', initialRoots);

  h = makeHardener(initialRoots);
}

const constHarden = h;
export default constHarden;
