import { v2 as cloudinary } from 'cloudinary'
import type { ImageLocation } from "@/types/types.js"
import { createDirectory, directory, getFileName, handleError } from '@/utils/helpers.js'
import { basename, dirname, join } from 'node:path'

const NAME = 'BASE IMAGE'

/**
 * Base Cloudinary to local file image definitions.
 */
export default class BaseImage {
  location: ImageLocation = {
    localFile: '',
    localDestination: '',
    publicId: '',
    cloudinaryAssetFolder: ''
  }

  constructor (options: ImageLocation) {
    this.initialize(options)

    // Initialize Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })
  }

  initialize (options: ImageLocation) {
    if (!Boolean(options.localFile)) {
      throw new Error('BASE IMAGE: missing localFile or localDestination params')
    }

    this.location = options

    if (!Boolean(this.location.publicId)) {
      this.location.publicId = this.location.localFile.substring(
        this.location.localFile.lastIndexOf('/') + 1,
        this.location.localFile.length
      )
    }

    if (!Boolean(this.location.localDestination)) {
      createDirectory(this.location.localFile)
        .then(destDir => {
          const fileName = getFileName(this.location.localFile)
          const destFile = join(destDir, fileName)
          this.location.localDestination = destFile
        })
        .catch(err => {
          throw new Error(`${NAME}: Failed to create destination directory`)
        })
    }
  }

  /**
   * Set the internal publicId
   */
  set publicId (publicId: string) {
    this.location.publicId = publicId
  }

  /**
   * Get the internal publicId
   */
  get publicId () {
    return this.location.publicId ?? '-'
  }

  set cloudinaryAssetFolder (assetFolder: string) {
    this.location.cloudinaryAssetFolder = assetFolder
  }

  get cloudinaryAssetFolder () {
    return this.location.cloudinaryAssetFolder ?? '-'
  }
}
