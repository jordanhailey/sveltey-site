const config = {
  "transform": {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest",
  },
  "moduleFileExtensions": [
    "js",
    "ts"
  ],
  "preset": 'ts-jest',
  "testEnvironment": 'node',
}

export default config;
