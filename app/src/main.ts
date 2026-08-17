import { join } from "node:path";
import dotenv from 'dotenv'

import CloudinaryImage from "./lib/image.js";

dotenv.config()

const main = async () => {
  try {
    const dir = join(process.cwd(), 'assets')
    const file = join(dir, 'seed.png')

    const image = new CloudinaryImage({
      localFile: file,
      cloudinaryAssetFolder: 'image-optimizer'
    })

    const resUpload = await image.upload()
    const resOptimize = await image.optimize()

    console.log('---done', resOptimize )
  } catch (err) {
    console.log('---err', err.message)
  }
}

main()
