const { createDefaultPreset } = require("ts-jest");

/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  ...createDefaultPreset(),
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
