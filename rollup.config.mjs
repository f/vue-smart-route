import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import clear from 'rollup-plugin-clear';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  external: ['vue'],
  plugins: [
    typescript({
      experimentalDecorators: true,
      module: 'esnext',
      clean: true,
    }),
    vue()
  ],
}