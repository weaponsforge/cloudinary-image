import { resolve } from 'node:path'
import dotenv from 'dotenv'

import { CloudinaryImage } from '@/lib/image.js'
import { handleLogError } from '@/utils/helpers.js'

dotenv.config()

const log = (str: string) => {
  console.log(`[OPTIMIZE] ${str}`)
}

export const optimize = async (args: Record<string, string | boolean>) => {
  const {
    file = '',
    assetfolder = 'image-optimizer',
    outputFolder = '',
    tags = '',
    width = 800,
    upload = false,
    deleteAfter = false,
  } = args

  const filePath = String(file)
  let outDir = null

  if (outputFolder) {
    outDir = resolve(String(outputFolder))
  }

  log(`Input file:\n${filePath}`)
  log(`Output folder: ${outDir}`)
  log(`Cloudinary asset folder: ${assetfolder}`)
  log(`Tags: ${tags}`)
  log(`Image width: ${width}`)
  log(` -upload? ${upload}`)
  log(` -delete cloud file? ${deleteAfter}\n`)

  try {
    const image = new CloudinaryImage({
      localFile: filePath,
      cloudinaryAssetFolder: String(assetfolder),
      ...(outDir && { localDestination: outDir }),
    })

    if (upload) {
      await image.upload(String(tags))
    }

    await image.optimize(Number(width))

    if (deleteAfter) {
      await image.delete()
    }
  } catch (err) {
    handleLogError(err, 'ERROR')
  }
}
