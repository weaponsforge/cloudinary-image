import { join } from 'node:path'

import { AssetManager } from '@/lib/cloudinary/manager.js'
import { AssetService } from '@/lib/cloudinary/service.js'
import { BaseImage } from '@/lib/cloudinary/baseimage.js'
import { Transform } from '@/lib/cloudinary/transform.js'

// Class for managing Cloudinary assets
const _manager = new AssetManager()

// Class for uploading and fetching images from Cloudinary
const _service = new AssetService()

// Class for generating Cloudinary image transformations
const _transformer = new Transform()

// Initialize a new BaseImage - no Cloudinary libraries
const inputFile = join(process.cwd(), 'boat.jpg')
const outputFile = join(process.cwd(), 'images', 'done', 'processed.jpg')

const _image = new BaseImage({
  localFile: inputFile,
  cloudinaryAssetFolder: 'my-folder',
  localDestination: outputFile, // optional
})

// Note: the CloudinaryImage class is composed of all these components
