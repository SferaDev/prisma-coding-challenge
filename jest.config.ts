import type { Config } from "@jest/types";
import * as path from "path";

const config: Config.InitialOptions = {
    verbose: true,
    rootDir: path.resolve("."),
    setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],
    testRegex: "((\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    moduleNameMapper: {
        "^~/(.*)$": "<rootDir>/app/$1",
    },
};

export default config;
