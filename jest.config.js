/* eslint-disable @typescript-eslint/no-var-requires */
const {
  resolve
} = require('path');

module.exports = {
preset: 'ts-jest',
testEnvironment: 'node',
moduleFileExtensions: [
  "js",
  "json",
  "ts"
],
roots: ['<rootDir>/'],
testRegex: [".spec.ts$",".e2e-spec.ts"],
transform: {
'^.+\\.(t|j)s\$': 'ts-jest',
},
moduleNameMapper: {
  '^@utils/(.*)$': resolve(__dirname, './src/utils/$1'),
  '^@providers/(.*)$': resolve(__dirname, './src/providers/$1'),
  '^@dto/(.*)$': resolve(__dirname, './src/database/dto/$1'),
  '^@cache/(.*)$': resolve(__dirname, './src/cache/$1'),
  '^@repo/(.*)$': resolve(__dirname, './src/database/repositories/$1'),
  '^@schemas/(.*)$': resolve(__dirname, './src/database/schemas/$1'),
  '^@urban/(.*)$': resolve(__dirname, './src/urban-coverage/$1'),
  '^@interceptors/(.*)$': resolve(__dirname, './src/interceptors/$1'),
  '^@seeds/(.*)$': resolve(__dirname, './seeds/$1'),
},
modulePaths: ['<rootDir>/src'],
coverageDirectory: "../coverage",
};
