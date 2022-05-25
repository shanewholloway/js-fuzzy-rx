import { terser as rpi_terser } from 'rollup-plugin-terser'
import rpi_resolve from '@rollup/plugin-node-resolve'
import pkg from './package.json'

const test_plugins = [ rpi_resolve() ]
const min_plugins = [ rpi_terser() ]

export default [
  ... add_out('fuzzy-rx', {out_name: pkg.name}),

  {input: 'test/simple.web.js', plugins: test_plugins,
    output: {file: 'test/esm/simple.web.js', format: 'es', sourcemap: true}},
]

function * add_out(src_name, opt={}) {
  let input = `src/${src_name}.js`
  let out_name = opt.name || opt.out_name || src_name

  yield { input, plugins: [],
    output: [
      { file: `esm/${out_name}.js`, format: 'es', sourcemap: true },
      { file: `cjs/${out_name}.js`, format: 'cjs', sourcemap: true, exports: 'named'},
      { file: `umd/${out_name}.js`, format: 'umd', sourcemap: true, exports: 'named', name: out_name},
    ]}

  if (min_plugins)
    yield { input, plugins: min_plugins,
      output: [
        { file: `esm/${out_name}.min.js`, format: 'es', sourcemap: false, exports: 'named'},
        { file: `umd/${out_name}.min.js`, format: 'umd', sourcemap: false, exports: 'named', name: out_name},
      ]}
}
