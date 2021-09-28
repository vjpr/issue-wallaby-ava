import * as swc from '@swc/core'
import {dirname} from 'path'

////////////////////////////////////////////////////////////////////////////////

const swcConfig = {
  test: '.tsx?$',
  sourceMaps: true,
  jsc: {
    target: 'es2020',
    parser: {
      syntax: 'typescript',
      tsx: true,
      decorators: true,
      dynamicImport: true,
    },
    baseUrl: './src',
    paths: {
      //'@src/*': ['*'],
      '@src/*': ['./src/*'],
      '#src/*': ['./src/*'],
      '#packages/*': ['./packages/*'],
    },
  },
  module: {
    //type: 'commonjs',
    type: 'es6',
  },
}
////////////////////////////////////////////////////////////////////////////////

export default function(w, {shouldLog} = {}) {
  return file => {
    const {type, path, content, config} = file
    const filename = path
    if (shouldLog) console.log('Compiling:', filename)
    const plugins = []
    const opts = {
      sourceRoot: dirname(filename),
      filename,
      //jsc // Config options can be added here.
      jsc: {...swcConfig.jsc},
      //plugin: swc.plugins(plugins),
    }
    const res = compile(filename, content, opts)
    //console.log({filename, content, res})
    return res
  }
}

////////////////////////////////////////////////////////////////////////////////

function compile(filename, code, opts) {
  const defaultSourceMap = true
  //const defaultSourceMap = 'inline' // originally
  const finalOpts = {
    ...opts,
    sourceMaps: opts.sourceMaps === undefined ? defaultSourceMap : opts.sourceMaps,
  }
  const output = swc.transformSync(code, finalOpts)
  return {
    map: output.map,
    code: output.code,
    // TODO(vjpr): We just use the entire code for now.
    //   I'm not exactly sure how this works.
    // See: https://wallabyjs.com/docs/config/compilers.html#writing-a-custom-compiler
    ranges: [[1, 0, 1, output.code.split('\n')]],
  }
}
