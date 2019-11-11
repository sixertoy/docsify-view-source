import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/view-source-plugin.js',
  output: {
    file: 'index.js',
    format: 'cjs',
  },
  plugins: [terser({ compress: true, mangle: true })],
};
