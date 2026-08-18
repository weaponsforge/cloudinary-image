#!/usr/bin/env node

import { parseArgs } from 'node:util'
import { optimize } from './optimize.js'

const { values } = parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
  options: {
    file: {
      type: 'string',
      short: 'f',
    },
    assetfolder: {
      type: 'string',
      short: 'a',
    },
    outputFolder: {
      type: 'string',
      short: 'o',
    },
    tags: {
      type: 'string',
      short: 't',
    },
    width: {
      type: 'string',
      short: 'w',
    },
    upload: {
      type: 'boolean',
      short: 'u',
    },
    deleteAfter: {
      type: 'boolean',
      short: 'd',
    },
  },
})

optimize(values)
