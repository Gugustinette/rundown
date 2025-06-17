# Rundown [![npm version][npm-version-src]][npm-version-href] [![npm downloads][npm-downloads-src]][npm-downloads-href] [![License][license-src]][license-href] [![Test][test-src]][test-href]

Run TypeScript in Node.js, powered by [Rolldown](https://rolldown.rs/).

Inspired by [tsx](https://tsx.is/).

## Usage

- Install `rundown`

```bash
# Global install on your system
npm install -g rundown
# Local install for your project
npm install -D rundown
```

- Run TypeScript files

```bash
# Global usage
rundown index.ts
# Local usage
./node_modules/.bin/rundown index.ts
```

- Available features
  - Run (by giving a file path)
  - Watch (`--watch` or `-w`)
  - Extends Node.js [REPL](https://nodejs.org/en/learn/command-line/how-to-use-the-nodejs-repl) (by giving no arguments at all)

## Development

- Install dependencies

```bash
npm install
```

- Build the project

```bash
npm run build
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/rundown/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/rundown
[npm-downloads-src]: https://img.shields.io/npm/dm/rundown.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/rundown
[license-src]: https://img.shields.io/npm/l/rundown.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/rundown
[test-src]: https://github.com/gugustinette/rundown/actions/workflows/test.yml/badge.svg
[test-href]: https://github.com/gugustinette/rundown/actions/workflows/test.yml
