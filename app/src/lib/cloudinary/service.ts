import { v2 as cloudinary } from 'cloudinary'
import { handleThrowError, writeToFileBuffer } from '@/utils/helpers.js'
import type { DeliveryType, ResourceType, UploadApiOptions } from 'cloudinary'
import { } from 'cloudinary'

const METHODS = {
  UPLOAD: 'UPLOAD',
  FETCH: 'FETCH',
  DELETE: 'DELETE',
}

type DeleteOptions = {
  resource_type?: ResourceType
  type?: DeliveryType
  invalidate?: boolean
}

type DeleteCallback = Parameters<typeof cloudinary.uploader.destroy>[1]

/**
 * Wrapper around the Cloudinary Upload API for uploading and fetching assets
 * @see https://cloudinary.com/documentation/image_upload_api_reference
 */
export default class AssetService {
  /**
   * Uploads an asset
   * @param file - Local file path of asset to upload
   * @param options - Cloudinary Uploader API `upload()` options
   * @returns
   */
  async upload (file: string, options: UploadApiOptions) {
    try {
      return await cloudinary.uploader.upload(file, options)
    } catch (err) {
      return handleThrowError(err, METHODS.UPLOAD)
    }
  }

  /**
   * Deletes an asset
   * @param publicId - Cloudinary image public ID
   * @param options - Cloudinary Uploader API `destroy()` options
   * @param callback - Function callback
   * @returns
   */
  async delete (
    publicId: string,
    options?: DeleteOptions,
    callback?: DeleteCallback,
  ) {
    try {
      return await cloudinary.uploader.destroy(publicId, options, callback)
    } catch (err) {
      return handleThrowError(err, METHODS.DELETE)
    }
  }

  /**
   * Downloads a Cloudinary asset to local disk
   * @param url - Public acessible Cloudinary URL to an asset
   * @param filePath - Local file path in which to save the asset
   */
  async fetch (url: string, filePath: string) {
    if (!url) throw new Error('Undefined URL')
    if (!filePath) throw new Error('Undefined filePath')

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch asset ${response.status}`)
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      writeToFileBuffer(filePath, buffer)

      console.log(`[${METHODS.FETCH}]: File downloaded in\n${filePath}`)
    } catch (err: unknown) {
      handleThrowError(err, METHODS.FETCH)
    }
  }
}
