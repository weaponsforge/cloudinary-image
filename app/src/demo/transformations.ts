import dotenv from 'dotenv'
import { CloudinaryImage } from '@/lib/image.js'
import { join } from 'node:path'

dotenv.config()

const main = async () => {
  const filePath = join(process.cwd(), 'boat.jpg')

  const image = new CloudinaryImage({
    localFile: filePath,
    cloudinaryAssetFolder: 'my-folder',
  })

  // await image.upload('sea,travel')

  // Generate URL of resized image
  const _urlResize = await image.transformer
    .resize(image.publicId, {
      width: 450,
    })

  // Generate URL of cropped image
  const urlCropped = await image.transformer
    .crop(image.publicId, {
      width: 400,
      height: 200,
      crop: 'scale',
    })

  // Generate URL of image's new format
  const _urlFormat = await image.transformer
    .format(image.publicId, 'webp')

  // Generate URL of image with improved quality
  const _urlQuality = await image.transformer
    .quality(image.publicId, 'auto')

  // Download one of the generated images
  const downloadFilePath = join(process.cwd(), image.name)
  await image.service.fetch(urlCropped, downloadFilePath)
}

main()
