const typescript = require("rollup-plugin-typescript2")
const commonjs = require("@rollup/plugin-commonjs")
const nodeResolve = require("@rollup/plugin-node-resolve");
const pkg = require("./package.json")
const path = require("path");

module.exports = {
  external: ["ts-morph", "pluralize"],
  input: path.join(__dirname, 'src/index.ts'),
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript()
  ],
}