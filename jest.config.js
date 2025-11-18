/**
 * Jest Configuration for Unit Tests
 */
module.exports = {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/tests/unit'],
    testMatch: ['**/*.test.js'],
    collectCoverageFrom: [
        'script.js',
        'src/**/*.js',
        '!**/node_modules/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    verbose: true
};
