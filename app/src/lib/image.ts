import { BaseImage } from './cloudinary/baseimage.js'
import { AssetService } from './cloudinary/service.js'
import { Transform } from './cloudinary/transform.js'
import { AssetManager } from './cloudinary/manager.js'
import { handleThrowError } from '@/utils/helpers.js'

import type { UploadApiResponse } from 'cloudinary'
import type { ImageTransformationOptions, ImageLocation } from '@/types/types.js'

const METHODS = {
  UPLOAD: 'CLOUD-IMAGE-UPLOAD',
  OPTIMIZE: 'CLOUD-IMAGE-OPTIMIZE',
  DELETE: 'CLOUD-IMAGE-DELETE',
}

/**
 * Cloudinary image methods with local image file definitions
 */
export class CloudinaryImage extends BaseImage {
  service = new AssetService()
  manager = new AssetManager()
  transformer = new Transform()

  meta: UploadApiResponse | null = null

  constructor (options: ImageLocation) {
    super(options)
  }

  /**
   * Uploads the `localFile` image to the `cloudinaryAssetFolder`
   * @param tags - Comma-separated string tags associate with the image
   */
  async upload (tags?: string) {
    try {
      this.log(`Uploading ${this.location.localFile} to\n${this.cloudinaryAssetFolder}`)

      const response = await this.service.upload(this.location.localFile, {
        public_id: this.publicId,
        asset_folder: this.cloudinaryAssetFolder,
        ...(tags && { tags }),
      })

      this.meta = response

      return response
    } catch (error) {
      return handleThrowError(error, METHODS.UPLOAD)
    }
  }

  /**
   * Optimizes the image uploaded in `localFile` in `cloudinaryAssetFolder` by
   * resizing it to max 800px (or retaining size if < 800) and converting to webp.
   * Downloads the optimized image into a `"processed"` folder relative to the `localFile`
   * @param customWidth - Custom image width
   * @returns
   */
  async optimize (customWidth: number = 800) {
    try {
      this.log('Starting optimization...')
      this.log('Fetching Cloudinary resource...')

      const maxWidth = 800
      const resource = await this.manager.getResource(this.location.publicId!)
      const { public_id, width } = resource

      const transformOptions: ImageTransformationOptions[] = []

      if (width > maxWidth) {
        transformOptions.push({
          width: customWidth,
          crop: 'scale',
        })
      }

      transformOptions.push({
        fetch_format: 'webp',
      })

      this.log('Generating optimized image URL...')
      const cloudinaryURL = await this.transformer.quality(
        public_id,
        'auto',
        transformOptions,
      )

      this.log('Fetching optimized image...')

      return await this.service.fetch(cloudinaryURL, this.location.localDestination!, 'webp')
    } catch (error) {
      handleThrowError(error, METHODS.OPTIMIZE)
    }
  }

  /**
   * Deletes this image asset
   */
  async delete () {
    try {
      this.log(`Deleting ${this.publicId}...`)
      const result = await this.service.delete(this.publicId, { invalidate: true })

      console.log(result)
    } catch (err) {
      handleThrowError(err, METHODS.DELETE)
    }
  }
}
