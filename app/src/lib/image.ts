import BaseImage from './cloudinary/baseimage.js'
import AssetService from './cloudinary/service.js'
import type { ImageLocation, TransformationParams } from '@/types/types.js'
import Transform from './cloudinary/transform.js'
import type { UploadApiResponse } from 'cloudinary'
import AssetManager from './cloudinary/manager.js'
import { handleThrowError } from '@/utils/helpers.js'

const METHODS = {
  UPLOAD: 'CLOUD-IMAGE-UPLOAD',
  OPTIMIZE: 'CLOUD-IMAGE-OPTIMIZE',
}

export default class CloudinaryImage extends BaseImage {
  service = new AssetService()
  manager = new AssetManager()
  transformer = new Transform()

  meta: UploadApiResponse | null = null

  constructor (options: ImageLocation) {
    super(options)
  }

  /**
   * Uploads the `localFile` image to the `cloudinaryAssetFolder`
   */
  async upload () {
    try {
      this.log(`Uploading ${this.location.localFile} to\n${this.cloudinaryAssetFolder}`)

      const response = await this.service.upload(this.location.localFile, {
        public_id: this.publicId,
        asset_folder: this.cloudinaryAssetFolder,
      })

      this.meta = response

      return response
    } catch (error) {
      return handleThrowError(error, METHODS.UPLOAD)
    }
  }

  /**
   * Optimizes the image uploaded in `localFile` in `cloudinaryAssetFolder` by
   * resizing it to max 800px (or retaining size if < 800) and converting to webp
   * @param customWidth - Custom image width
   * @returns
   */
  async optimize (customWidth: number = 800) {
    try {
      this.log('\nStarting optimization...')
      this.log('Fetching Cloudinary resource...')

      const maxWidth = 800
      const resource = await this.manager.getResource(this.location.publicId!)
      const { public_id, width } = resource

      let transformOptions: TransformationParams = {
        fetch_format: 'webp',
      }

      if (width > maxWidth) {
        transformOptions = {
          ...transformOptions,
          width: customWidth,
          crop: 'scale',
        }
      }

      this.log('Optimizing image...')
      const result = await this.transformer.quality(public_id, 'auto', transformOptions)

      this.log('Fetching optimized image...')

      return await this.service.fetchImage(result, this.location.localDestination!)
    } catch (error) {
      handleThrowError(error, METHODS.OPTIMIZE)
    }
  }

  async delete () {
    return await this.manager.deleteResources([this.publicId])
  }
}
