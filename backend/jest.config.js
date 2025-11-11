export default {
    "testEnvironment": "node",
    "transform": {
        "^.+\\.js$": "babel-jest"
    },
    "moduleFileExtensions": ["js"],
    "roots": [
        "<rootDir>"
    ],
    "testMatch": [
        "**/__tests__/**/*.test.js"
    ],
    "moduleDirectories": [
        "node_modules"
    ],
    "collectCoverage": true,
    "coverageDirectory": "coverage",
    "coverageReporters": [
        "json",
        "lcov",
        "text",
        "clover"
    ]
}