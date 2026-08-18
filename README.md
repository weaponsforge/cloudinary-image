## cloudinary-image

Cloudinary image optimization CLI with Node.js wrappers for select [Cloudinary Node.js APIs](https://cloudinary.com/documentation/node_image_manipulation)<br>
covering image transformation, optimization, and asset management.

### Requirements

- Node v24+
- Docker (optional)
- Cloudinary account

## Installation

Create a `.env` file in the `/app` directory, replacing the contents of the `.env.example` file with actual values.

| Variable Name | Description |
| --- | --- |
| CLOUDINARY_NAME | Cloudinary account name |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |

## Usage

#### A. Using Docker

1. Build the image.<br>
`docker compose build`

2. Run the container.<br>
`docker compose up`

3. Run the [Available Scripts](#available-scripts) using Docker.

**Example using the development Docker image**

(PowerShell - development)

```sh
docker exec cloudinary-cli-dev npm run docker:debug -- -f /opt/app/assets/sunset.jpg -u -d
```

**Example using stand-alone production Docker image**

(PowerShell - production)

Build the production image with<br>
`docker compose -f docker-compose.prod.yml build`

```sh
 docker run --rm --env-file .env `
   -v ${pwd}/assets:/images `
   weaponsforge/cloudinary-cli `
   -f /images/sunset.jpg -u
```

#### B. Using Node.js

1. Install dependencies.<br>

   ```sh
   cd app
   npm install
   ```

2. Run the [Available Scripts](#available-scripts).

## Available Scripts

### `npm start`

Optimizes an input image using the Cloudinary image transformations.
Downloads the optimized image to a `/processed` directory relative to the input file, or to a specified output directory.

> **NOTE**: this requires transpiling TypeScript into JavaScript first via `npm run build`.

**Example Usage**

```sh
npm start -- -f /path/to/file.jpg -u -d
```

**CLI Guide**

```sh
npm start -- \
  -f /path/to/file.jpg       # Full input image file path
  -o /output/folder/path     # (Optional) output folder
  -a my-asset-folder         # (Optional) Cloudinary asset folder
  -t cars,vehicles,tech      # (Optional) image tags
  -w 600                     # (Optional) width to resize the image. Default is 800
  -u                         # (Optional) flag to upload the input image to Cloudinary. Required on 1st run.
  -d                         # (Optional) flag to delete the uploaded image in Cloudinary
```

> **NOTE**: This script is also accessible using `npx optimize` minus the `--` flag.

### `npm run dev`

Runs the `npm start` script in development mode with `tsx`.

Example usage:<br>
`npm run dev -- -f /assets/sunset.jpg -u`

### `npm run info`

Logs the installed Node.js and npm version, environment platform, architecture and V8 version.

### `npm run build`

Builds JavaScript, `.d.ts` declaration files, and map files from the TypeScript source files in the `/src` directory to the `/dist` directory.

### `npm run types:check`

Runs type-checking without generating the JavaScript or declaration files from the TypeScript files in the `/src` directory.

### `npm run lint`
Lints TypeScript source codes.

### `npm run lint:fix`
Fixes lint errors in TypeScript files.

### `npm run watch`

Watches file changes in `.ts` files using the `tsc --watch` option.

### `npm run docker:watch:win`

Watches file changes in `.ts` files using the `tsc --watch` option with `dynamicPriorityPolling` in Docker containers running in Windows WSL2.

## 🧾 Code Samples

### A. Optimize an Image

```typescript
import { join } from 'node:path'
import dotenv from 'dotenv'
import { CloudinaryImage } from '@/lib/image.js'

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
import { CloudinaryImage } from '@/lib/image.js'
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
```

## References

- [Cloudinary NPM Registry](https://www.npmjs.com/package/cloudinary)
- [Cloudinary Node.js Docs](https://cloudinary.com/documentation/node_image_manipulation)

@weaponsforge<br>
20260817
