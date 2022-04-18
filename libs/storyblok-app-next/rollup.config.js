// import typescript froyarn m 'rollup-plugin-typescript2'
import typescript from '@rollup/plugin-typescript';
import multiInput from 'rollup-plugin-multi-input';

import resolve from '@rollup/plugin-node-resolve';
import depsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const packageJson = require('./package.json');
const external = [...Object.keys(packageJson.peerDependencies || {})];

export default ({
    input: `./src/**/index.ts`,
    output: {
        dir: `./dist`,
        format: 'esm',
        sourcemap: true,
    },
    external,
    plugins: [
        json(), // needed for openid-client, for some reason
        depsExternal(),
        resolve(),
        commonjs(),
        typescript({
            declaration: true,
            declarationDir: `./dist`
        }),
        multiInput(),
    ]
})
