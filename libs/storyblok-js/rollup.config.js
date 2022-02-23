import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const packageJson = require('./package.json');
export default {
    input: './src/index.ts',
    output: [{
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
    }, {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
    }],
    plugins: [
        external(),
        resolve(),
        commonjs(),
        typescript(),
        terser(),
    ],
}

// {
//     input: 'dist/esm/types/index.d.ts',
//         output: [{ file: 'dist/index.d.ts', format: "esm" }],
//     external: [/\.css$/],
//     plugins: [dts()],
// }