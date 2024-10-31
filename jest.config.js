module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.spec.ts'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
};