import { v2 as cloudinary } from 'cloudinary'
import { handleError, writeToFileBuffer } from '@/utils/helpers.js'
import type{ UploadApiOptions } from 'cloudinary'

const METHODS = {
  UPLOAD: 'UPLOAD',
  FETCH: 'FETCH'
}

export default class AssetService {
  async upload (file: string, options: UploadApiOptions) {
    try {
      return await cloudinary.uploader.upload(file, options)
    } catch (err) {
      return handleError(err, METHODS.UPLOAD)
    }
  }

  async fetchImage (url: string, filePath: string) {
    if (!Boolean(url)) throw new Error('Undefined URL')
    if (!Boolean(filePath)) throw new Error('Undefined filePath')

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch image ${response.status}`)
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      writeToFileBuffer(filePath, buffer)

      console.log(`[${METHODS.FETCH}]: File downloaded in\n${filePath}`)
    } catch (err: unknown) {
      handleError(err, METHODS.FETCH)
    }
  }
}
