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
        sourcemap: true,
      },
    ],
    plugins: [typescript({ tsconfig: './tsconfig.cjs.json' })],
  },
]
