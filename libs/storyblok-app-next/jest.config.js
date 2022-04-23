import dotenv from 'dotenv'
// import { pathsToModuleNameMapper } from 'ts-jest/utils';
// import tsconfig from './tsconfig.json' assert { type: 'json' };
import path from 'path'

dotenv.config({path: '.env.test'});

// const moduleNameMapper = pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: '<rootDir>/' });

if (!process.env.STORYBLOK_CLIENT_SECRET || !process.env.STORYBLOK_CLIENT_ID || !process.env.NEXTAUTH_URL) {
    throw new Error('The following environmental variables must be defined in .env.test: STORYBLOK_CLIENT_ID, STORYBLOK_CLIENT_SECRET, NEXTAUTH_URL')
}


export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    "moduleNameMapper": {
        "^@src(.*)$": "<rootDir>/src$1"
    }
}