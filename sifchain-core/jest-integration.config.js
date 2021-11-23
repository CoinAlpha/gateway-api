module.exports = {
  name: "integration",
  testMatch: ["**/*.spec.ts"],
  testTimeout: 1000000,
  bail: true,
  coveragePathIgnorePatterns: ["<rootDir>/src/generated/"],
};
