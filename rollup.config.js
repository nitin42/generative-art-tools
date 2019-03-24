import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import pkg from './package.json'

const ensureArray = maybeArr => (Array.isArray(maybeArr) ? maybeArr : [maybeArr])

const createConfig = ({ output, min = false, env } = {}) => ({
  input: 'src/index.js',
  output: ensureArray(output).map(format =>
    Object.assign({}, format, {
      name: 'GenerativeArtTools',
      exports: 'named',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'two.js': 'Two',
        p5: 'p5',
        glslCanvas: 'GlslCanvas'
      }
    })
  ),
  external: ['two.js', 'p5', 'react', 'react-dom', 'glslCanvas'],
  plugins: [
    babel({ plugins: ['external-helpers'] }),
    env && replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
    min && uglify()
  ].filter(Boolean)
})

export default [
  createConfig({
    output: [{ file: pkg.main, format: 'cjs' }, { file: pkg.module, format: 'es' }]
  }),
  createConfig({
    output: { file: pkg.unpkg, format: 'umd' },
    env: 'production',
    min: true
  })
]
