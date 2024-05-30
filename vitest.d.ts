/* eslint-disable */
import Graphology from 'graphology';

interface CustomMatchers<R = unknown> {
  toBeColored: () => R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}