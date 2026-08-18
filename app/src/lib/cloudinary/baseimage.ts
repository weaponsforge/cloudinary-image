import { join } from 'node:path'
import { v2 as cloudinary } from 'cloudinary'

import { createDirectory, getFileName } from '@/utils/helpers.js'
import type { ImageLocation } from '@/types/types.js'

const CLASS_NAME = 'BASE IMAGE'

/**
 * Base image class with local file definitions and metadata.
 */
export class BaseImage {
  location: ImageLocation = {
    localFile: '',
    localDestination: '',
    publicId: '',
    cloudinaryAssetFolder: '',
  }

  name: string = ''

  constructor (options: ImageLocation) {
    this.initialize(options)

    // Initialize Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }

  initialize (options: ImageLocation) {
    if (!options.localFile) {
      throw new Error(`${CLASS_NAME}: missing localFile input`)
    }

    const fileName = getFileName(options.localFile)
    this.name = getFileName(options.localFile)
    this.location = options

    if (!this.location.publicId) {
      const endIndex = fileName.indexOf('.') >= 1
        ? fileName.indexOf('.')
        : fileName.length

      this.location.publicId = fileName.substring(0, endIndex)
    }

    if (!this.location.localDestination) {
      // Create a "processed" directory relative to the file
      createDirectory(this.location.localFile)
        .then(destDir => {
          const destFile = join(destDir, fileName)
          this.location.localDestination = destFile
        })
        .catch(err => {
          throw new Error(
            `${CLASS_NAME}: Failed to create destination directory`, {
              cause: err,
            })
        })
    } else {
      this.location.localDestination = join(this.location.localDestination, `${fileName}`)
    }
  }

  log (message: string) {
    console.log(`[${this.name}]: ${message}`)
  }

  /**
   * Sets the internal publicId
   */
  set publicId (publicId: string) {
    this.location.publicId = publicId
  }

  /**
   * Returns the internal publicId
   */
  get publicId () {
    return this.location.publicId ?? '-'
  }

  /**
   * Sets the cloudinaryAssetFolder
   */
  set cloudinaryAssetFolder (assetFolder: string) {
    this.location.cloudinaryAssetFolder = assetFolder
  }

  /**
   * Returns the internal cloudinaryAssetFolder
   */
  get cloudinaryAssetFolder () {
    return this.location.cloudinaryAssetFolder ?? '-'
  }
}
