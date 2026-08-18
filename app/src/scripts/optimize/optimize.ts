import { join } from 'node:path'
import dotenv from 'dotenv'

import CloudinaryImage from '@/lib/image.js'
import { handleLogError } from '@/utils/helpers.js'

dotenv.config()

const main = async () => {
  try {
    const dir = join(process.cwd(), 'assets')
    const file = join(dir, 'mecha_poster_02.png')

    const image = new CloudinaryImage({
      localFile: file,
      cloudinaryAssetFolder: 'image-optimizer',
    })

    await image.upload('gundam,seed,mobile suit')
    await image.optimize()
    await image.delete()
  } catch (err) {
    handleLogError(err, 'ERROR')
  }
}

if (process.env.IS_DOCKER === 'true') {
  setTimeout(() => {
    main()
  }, 5000)
} else {
  main()
}
