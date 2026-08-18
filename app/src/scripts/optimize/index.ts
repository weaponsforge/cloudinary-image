#!/usr/bin/env node

import { parseArgs } from 'node:util'
import { optimize } from './optimize.js'

const { values } = parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
  options: {
    file: { // Path to input image file
      type: 'string',
      short: 'f',
    },
    assetfolder: { // Cloudinary asset folder (optional). Defaults to "image-optimizer"
      type: 'string',
      short: 'a',
    },
    outputFolder: { // Local image download folder (optional)
      type: 'string',
      short: 'o',
    },
    tags: { // Comma-separated Cloudinary image tags (optional)
      type: 'string',
      short: 't',
    },
    width: { // Image width to resize the input image (optional), default=800px
      type: 'string',
      short: 'w',
    },
    upload: { // Flag to upload the input inmage to Cloudinary.
      type: 'boolean', // Required on first-time, optional on succeeding runs.
      short: 'u',
    },
    deleteAfter: { // Flag to delete the uploaded image in Cloudinary (optional)
      type: 'boolean',
      short: 'd',
    },
  },
})

if (process.env.IS_DOCKER) {
  setTimeout(() => {
    optimize(values)
  }, 5000)
} else {
  optimize(values)
}
