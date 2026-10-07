## cloudinary-image

Cloudinary-powered image optimization CLI with Node.js wrappers for select [Cloudinary Node.js APIs](https://cloudinary.com/documentation/node_image_manipulation), covering automatic image optimization, transformation, and asset management.

Cloudinary's automatic optimization reduces the need to manually tune image dimensions, quality, compression, and formats. Unlike libraries such as Sharp or FFmpeg, where developers often need to experiment with processing parameters to find the right balance between visual quality and file size, Cloudinary can automatically optimize images for efficient delivery while preserving visual quality.

The result: less optimization guesswork, smaller assets, and better image delivery with less application-side processing.

### CLI Available

> - **Run via npx (no installation required)**
>   - Requirements: NodeJS LTS v24.11.0 or later, and a `.env` file
>   - Run `npx cloudinary-image -f ./full/path/to/picture.jpg -u -d`
>
> - **Docker image**<br>
>   A Docker image is available at<br>https://hub.docker.com/r/weaponsforge/cloudinary-cli

### Requirements

- Node v24+
- Cloudinary account

## 🆕 Quickstart

1. Install the library.

   ```sh
   npm i cloudinary-image
   ```

2. Create a `.env` file in your project directory, replacing the contents of the `.env.example` file with actual values.

   | Variable Name | Description |
   | --- | --- |
   | CLOUDINARY_NAME | Cloudinary account name |
   | CLOUDINARY_API_KEY | Cloudinary API key |
   | CLOUDINARY_API_SECRET | Cloudinary API secret |

3. Optimize images programmatically via code. See the examples under the [Code Samples](#-code-samples) section for more information.

<br>

## 🧾 Code Samples

### A. Optimize an Image

```typescript
import { join } from 'node:path'
import dotenv from 'dotenv'
import { CloudinaryImage } from 'cloudinary-image'

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
```

### B. Apply Image Transformations

```typescript
import dotenv from 'dotenv'
import { CloudinaryImage } from 'cloudinary-image'
import { join } from 'node:path'

dotenv.config()

const main = async () => {
  const filePath = join(process.cwd(), 'boat.jpg')

  const image = new CloudinaryImage({
    localFile: filePath,
    cloudinaryAssetFolder: 'my-folder',
  })

  // Upload image to Cloudinary
  await image.upload('sea,travel')

  // Generate URL of resized image
  const urlResize = await image.transformer
    .resize(image.publicId, {
      width: 450
    })

  // Generate URL of cropped image
  const urlCropped = await image.transformer
    .crop(image.publicId, {
      width: 400,
      height: 200,
      crop: 'scale'
    })

  // Generate URL of image's new format
  const urlFormat = await image.transformer
    .format(image.publicId, 'webp')

  // Generate URL of image with improved quality
  const urlQuality = await image.transformer
    .quality(image.publicId, 'auto')

  // Download one of the generated images
  const downloadFilePath = join(process.cwd(), image.name)
  await image.service.fetch(urlCropped, downloadFilePath)
}

main()
```

### C. Using Classes

```typescript
import { join } from 'node:path'

import {
  AssetManager,
  AssetService,
  BaseImage,
  Transform
} from 'cloudinary-image'

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
```

## References

- [Cloudinary NPM Registry](https://www.npmjs.com/package/cloudinary)
- [Cloudinary Node.js Docs](https://cloudinary.com/documentation/node_image_manipulation)

@weaponsforge<br>
20260819
