import type {Config} from 'jest';

const config: Config = {
  verbose: true,

  clearMocks: true,

  collectCoverage: true,

  collectCoverageFrom: ["<rootDir>/src/lib/**/*.ts"],

  coverageDirectory: "coverage",

  coverageReporters: [ "text", "lcov"],

  preset: "ts-jest",

  testMatch: ["**/__tests__/**/*.ts"]
};

export default config;