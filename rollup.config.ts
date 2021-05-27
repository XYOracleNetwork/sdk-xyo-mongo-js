import typescript from '@rollup/plugin-typescript'

export default [
  {
    external: ['axios', 'tslib', '@xyo-network/sdk-xyo-js', 'async-mutex', 'mongodb'],
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [typescript({ tsconfig: './tsconfig.json' })],
  },
]
