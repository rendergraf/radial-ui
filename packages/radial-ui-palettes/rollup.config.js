// rollup.config.js
import typescript from '@rollup/plugin-typescript'
import { promises as fs } from 'fs';

export default {
  input: './src/index.ts',
  output: [
    {
      file: './dist/index.js',
      format: 'cjs',
    },
    {
      file: './dist/index.mjs',
      format: 'es',
    },
  ],
  plugins: [
    typescript({}),
    {
      name: 'create-folfers',
      async generateBundle() {
        try {
          await fs.mkdir('./dist/css-palettes', { recursive: true });
          console.log('folders created!.');
        } catch (error) {
          console.error('Error created folders /dist and /dist/css-palettes', error);
        }
      },
    },
  ],
}