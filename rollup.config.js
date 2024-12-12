import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
export default {
  input: 'src/main.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    name: 'my-plugin',
  },
  plugins: [
    del({
      deleteOnce: false,
      targets: ['dist/'],
    }),
    commonjs(),
    resolve(),
    json(),
    copy({
      targets: [{ src: 'src/template', dest: 'dist/' }],
    }),
  ],
};
