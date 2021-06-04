import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default [
  {
    external: ['axios', 'tslib', '@xyo-network/sdk-xyo-js', 'async-mutex', 'mongodb'],
    input: 'src/index.ts',
    output: [
      {
        exports: 'auto',
        file: 'dist/index.cjs',
        format: 'cjs',
      },
      {
        exports: 'auto',
        file: 'dist/index.js',
        format: 'es',
      },
    ],
    plugins: [typescript({ tsconfig: './tsconfig.json' }), commonjs()],
  },
]
