import { v2 as cloudinary, type AdminAndPublishOptions } from 'cloudinary'

export default class AssetManager {
  async getUrl (publicId: string) {
    return await cloudinary.url(publicId)
  }

  async getResource (publicId: string, options?: AdminAndPublishOptions | undefined) {
    return await cloudinary.api.resource(publicId, options)
  }

  async deleteResources (publicIds: string[] = []) {
    if (publicIds.length === 0) return
    const result = await cloudinary.api.delete_resources(publicIds, { invalidate: true })
    console.log(result)
  }
}
