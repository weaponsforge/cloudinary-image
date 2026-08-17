import { v2 as cloudinary, type AdminAndPublishOptions } from 'cloudinary'

export default class AssetManager {
  async getUrl (publicId: string) {
    return await cloudinary.url(publicId)
  }

  async getResource (publicId: string, options?: AdminAndPublishOptions | undefined) {
    return await cloudinary.api.resource(publicId, options)
  }
}
