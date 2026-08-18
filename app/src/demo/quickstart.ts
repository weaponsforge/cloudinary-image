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

  await image.upload('sea,travel')
  await image.optimize(600)
  await image.delete()
}

main()
