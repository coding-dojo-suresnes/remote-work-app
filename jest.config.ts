/* eslint-disable  */
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

export default {
  roots: ['<rootDir>'],
  collectCoverage: true,
  testMatch: ['<rootDir>/**/*.spec.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  setupFiles: ['dotenv/config'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};
