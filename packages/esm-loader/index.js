export async function resolve(specifier, context, defaultResolve) {
  return defaultResolve(specifier, context, defaultResolve)
}

export function getFormat(url, context, defaultGetFormat) {
  return defaultGetFormat(url, context, defaultGetFormat)
}

export function transformSource(source, context, defaultTransformSource) {
  return defaultTransformSource(source, context, defaultTransformSource)
}

// From `wallaby/runners/node/ava@1.0.0/hooks.mjs`
export async function getSource(url, context, defaultGetSource) {
  if (url.endsWith('ava/entrypoints/main.mjs')) {
    return {
      source: `
export default function() {
  const runner = global.$_$tracer.avaRunner;
  var avaModuleExports = runner.test || runner.chain.test || runner.chain;
  return avaModuleExports.apply(this, arguments);
};

export function test() {
  const runner = global.$_$tracer.avaRunner;
  var avaModuleExports = runner.test || runner.chain.test || runner.chain;
  return avaModuleExports.apply(this, arguments);
};
`,
    }
  }
  const src = await defaultGetSource(url, context, defaultGetSource)
  //console.log(src.source.toString())
  return src
}
