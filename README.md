## image-cli

CLI that supports Cloudinary image transformations.

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

> **NOTE**: This script is also accessible using `npx optimize`

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

## References

- [Cloudinary NPM Registry](https://www.npmjs.com/package/cloudinary)
- [Cloudinary Node.js Docs](https://cloudinary.com/documentation/node_image_manipulation)

@weaponsforge<br>
20260817
