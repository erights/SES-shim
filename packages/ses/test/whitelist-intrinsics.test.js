import tap from 'tap';
import { getIntrinsics } from '../src/intrinsics.js';
import whitelistIntrinsics from '../src/whitelist-intrinsics.js';

const { test } = tap;

// eslint-disable-next-line no-eval
if (!eval.toString().includes('native code')) {
  throw new TypeError('Module "esm" enabled: aborting');
}

test('whitelistPrototypes - on', t => {
  t.plan(5);
  // This test will modify intrinsics and should be executed
  // in a brand new realm.

  globalThis.foo = 1;
  Object.foo = 1;
  Object.freeze.foo = 1;
  // eslint-disable-next-line no-extend-native
  Object.prototype.foo = 1;
  Object.prototype.hasOwnProperty.foo = 1;

  console.time('Benchmark getIntrinsics()');
  const intrinsics = getIntrinsics();
  console.timeEnd('Benchmark getIntrinsics()');

  console.time('Benchmark whitelistIntrinsics()');
  whitelistIntrinsics(intrinsics);
  console.timeEnd('Benchmark whitelistIntrinsics()');

  t.equal(globalThis.foo, 1);
  t.equal(Object.foo, undefined);
  t.equal(Object.freeze.foo, undefined);
  t.equal(Object.prototype.foo, undefined);
  t.equal(Object.prototype.hasOwnProperty.foo, undefined);

  delete globalThis.foo;
});
