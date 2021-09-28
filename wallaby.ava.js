import swcCompiler from 'my-swc-compiler'

export default async w => {
  const esmLoaderUrl = await import.meta.resolve('my-esm-loader')
  const conf = {
    testFramework: 'ava',
    files: ['**/*.ts', '**/package.json', '!**/index.test.ava.ts', '!**/node_modules', '!.dev', '!.git'],
    tests: ['**/index.test.ava.ts', '!**/node_modules', '!.dev', '!.git'],
    trace: true,
    preprocessors: {
      '**/*.ts': tsPreprocessor(w),
    },
    compilers: {
      '**/*.ts': swcCompiler(w, {shouldLog: true}),
      '**/*.tsx': swcCompiler(w, {shouldLog: true}),
    },
    env: {
      type: 'node',
      params: {
        runner: [
          `--experimental-vm-modules`,
          `--experimental-loader=${esmLoaderUrl}`,
          `--experimental-specifier-resolution=node`,
          `--experimental-import-meta-resolve`,
        ].join(' ')
      }
    }
  }
  console.log(conf)
  return conf
}

////////////////////////////////////////////////////////////////////////////////

export function tsPreprocessor(wallaby) {
  return file => {
    const newName = file.path
      .replace(/.ts$/, '.js')
      .replace('src', 'lib') // TODO(vjpr): Make more robust.
    // We need to put it into `lib` dir, so your `imports` work.
    file.rename(newName)
    return file.content
  }
}
