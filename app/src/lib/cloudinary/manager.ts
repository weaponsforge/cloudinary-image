import { v2 as cloudinary, type AdminAndPublishOptions } from 'cloudinary'
import { handleThrowError } from '@/utils/helpers.js'

const METHODS = {
  URL: 'GET URL',
  RESOURCE: 'GET RESOURCE',
  DELETE_RESOURCES: 'DELETE RESOURCES',
}

/**
 * Wrapper around the Cloudinary Admin API for managing assets
 * @see https://cloudinary.com/documentation/node_asset_administration
 * @see https://cloudinary.com/documentation/admin_api
 */
export class AssetManager {
  /**
   * Retrieves the Cloudinary URL of an asset by `public_id`
   * @param publicId - Cloudinary image public ID
   * @returns Cloudinary asset URL
   */
  async getUrl (publicId: string) {
    try {
      return await cloudinary.url(publicId)
    } catch (err) {
      return handleThrowError(err, METHODS.URL)
    }
  }

  /**
   * Retrieves the metadata of a single Cloudinary resource (asset) by `public_id`
   * @see https://cloudinary.com/documentation/admin_api#get_details_of_a_single_resource_by_public_id
   * @param publicId - Cloudinary image public ID
   * @param options
   * @returns
   */
  async getResource (
    publicId: string,
    options?: AdminAndPublishOptions | undefined,
  ) {
    try {
      return await cloudinary.api.resource(publicId, options)
    } catch (err) {
      return handleThrowError(err, METHODS.RESOURCE)
    }
  }

  /**
   * Deletes resources by a list of `public_ids`
   * @see https://cloudinary.com/documentation/admin_api#delete_resources
   * @param publicIds - List of `public_ids`
   */
  async deleteResources (publicIds: string[] = []) {
    if (publicIds.length === 0) return

    try {
      const result = await cloudinary.api.delete_resources(publicIds, { invalidate: true })
      console.log(result)
    } catch (err) {
      return handleThrowError(err, METHODS.DELETE_RESOURCES)
    }
  }
}
