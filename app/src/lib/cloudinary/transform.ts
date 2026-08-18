import { v2 as cloudinary } from 'cloudinary'
import { handleThrowError } from '@/utils/helpers.js'
import type { ImageTransformationOptions } from '@/types/types.js'
import type { TransformationOptions } from '@/types/types.js'

const METHODS = {
  GENERAL: 'GENERAL TRANSFORM',
  RESIZE: 'RESIZE',
  CROP: 'CROP',
  FORMAT: 'FORMAT',
  QUALITY: 'QUALITY',
}

/**
 * Wrapper around the Cloudinary URL API for image transformations
 * @see https://cloudinary.com/documentation/node_image_manipulation
 * @see https://cloudinary.com/documentation/image_transformations
 */
export default class Transform {
  /**
   * Cloudinary.url() transformation wrapper
   * @param publicId - Cloudinary image public ID
   * @param transformation - Cloudinary URL transformation options
   * @returns
   */
  async transform (publicId: string, transformation: TransformationOptions) {
    try {
      return await cloudinary.url(publicId, { transformation })
    } catch (err) {
      return handleThrowError(err, METHODS.GENERAL)
    }
  }

  /**
   * Changes an asset's size by editing its width and/or height
   * @param publicId - Cloudinary image public ID
   * @param options - `ImageSize` Cloudinary URL transformation options
   * @param options.width - Image width to resize
   * @param options.height - Image height to resize
   * @returns Cloudinary image URL of the resized image
   */
  async resize (
    publicId: string,
    options: ImageTransformationOptions,
  ) {
    const { width, height } = options
    const hasWidth = Boolean(width)
    const hasHeight = Boolean(height)

    if (!hasWidth && !hasHeight) {
      throw new Error('One of width or height is required')
    }

    const transformation: ImageTransformationOptions = {
      ...(hasWidth && { width }),
      ...(hasHeight && { height }),
      crop: 'scale',
    }

    try {
      const result = await this.transform(publicId, transformation)
      console.log(`[${METHODS.RESIZE}]: Success`, result)

      return result
    } catch (err: unknown) {
      return handleThrowError(err, METHODS.RESIZE)
    }
  }

  /**
   * Crops an image
   * @param publicId - Cloudinary image public ID
   * @param options - `ImageCropOptions` Cloudinary URL transformation options for
   * @param options.width - Image width to resize
   * @param options.height - Image height to resize
   * @param options.crop - Decides how the image will fill the width and height.
   *    Possible values: scale | pad | thumb | fill
   * @param options.gravity - Gravitates focus to the most important part of the picture.
   *    Possible values: auto | face | south_west | southe_east | north_east, etc
   * @returns Cloudinary URL of the cropped image
   */
  async crop (
    publicId: string,
    options: ImageTransformationOptions,
  ) {
    if (!('width' in options) || !('height' in options)) {
      throw new Error(`${METHODS.CROP}: Required width and height`)
    }

    const {
      width,
      height,
      crop = 'pad',
    } = options

    try {
      const result = await this.transform(publicId, {
        width,
        height,
        crop,
      })

      console.log(`[${METHODS.CROP}]: Success`, result)

      return result
    } catch (error) {
      return handleThrowError(error, METHODS.CROP)
    }
  }

  /**
   * Convert assets to other formats.
   * Specify image and video format, eg., on native mobile based on device capabilities.
   * Allows cloudinary to deliver the optimal format for
   *    web delivery scenarios with f_auto according to device
   * @param publicId - Cloudinary image public ID
   * @param format - Image format
   * @returns
   */
  async format (
    publicId: string,
    format: string = 'auto',
    options?: ImageTransformationOptions,
  ) {
    try {
      const transformation = {
        fetch_format: format,
        ...(options && { options }),
      }

      const result = await this.transform(publicId, transformation)
      console.log(`[${METHODS.FORMAT}]: Success`, result)

      return result
    } catch (error) {
      return handleThrowError(error, METHODS.FORMAT)
    }
  }

  /**
   * Controls the visual quality and compression level of assets.
   * Allows Cloudinary to deliver the optimal quality for each viewing device with q_auto
   * @param publicId - Cloudinary image public ID
   * @param quality - Cloudinary Image quality
   * @param options - Cloudinary Image transform options
   * @returns
   */
  async quality (
    publicId: string,
    quality: string = 'auto',
    options?: ImageTransformationOptions[],
  ) {
    try {
      let transformation: ImageTransformationOptions[] = []

      if (Array.isArray(options)) {
        transformation = [...options]
      }

      transformation.push({ quality })

      const result = await this.transform(publicId, transformation)
      console.log(`[${METHODS.QUALITY}]: Success`, result)

      return result
    } catch (error) {
      return handleThrowError(error, METHODS.QUALITY)
    }
  }
}
