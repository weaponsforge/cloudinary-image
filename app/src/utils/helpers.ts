import { promises as fs } from 'node:fs'
import path, { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'url'

import dotenv from 'dotenv'

/**
 * Get the full file path of the current directory of a module file equivalent to `"__dirname"`
 * @param {string} moduleFile - File URL of the current module being executed: `"import.meta.url"`
 * @returns {string} Full file path to the directory of the calling file/module also know as `__dirname` in CommonJS
 */
export const directory = (moduleFile: string) => {
  return dirname(fileURLToPath(moduleFile))
}

/**
 * Copies files to an output directory
 * @param outDir File path to the output directory
 * @param files Array containing a list of file paths
 */
export const copyFiles = async (outDir: string, files: string[]) => {
  await fs.mkdir(outDir, { recursive: true })

  for (const src of files) {
    const dest = path.join(outDir, path.basename(src))
    await fs.copyFile(src, dest)
    console.log(`Copied to ${dest}`)
  }
}

/**
 * Extracts the filename from a full file path
 * @param pathToFile - Full file path to a local file
 * @returns filename
 */
export const getFileName = (pathToFile: string) => {
  return basename(pathToFile)
}

export const createDirectory = async (pathToFile: string, newDir: string = 'processed') => {
  const assetDir = dirname(pathToFile)
  const destDir = join(assetDir, newDir)

  await fs.mkdir(destDir, { recursive: true })

  return destDir
}

/**
 * Writes a buffer to file on disk
 * @param pathToFile - Full file path to a local file
 * @param buffer
 */
export const writeToFileBuffer = (pathToFile: string, buffer: Buffer<ArrayBuffer>) => {
  fs.writeFile(pathToFile, buffer)
}

/**
 * Loads the `.env` environment variable from a path
 * @param {string} pathToEnv - Path to a `.env` file
 */
export const loadEnv = (pathToEnv: string | undefined) => {
  if (!pathToEnv) return

  dotenv.config({
    path: pathToEnv,
    quiet: true,
  })
}

/**
 * Re-throws an Error with log from calling function
 * @param error - Error object
 * @param prefix - Calling function identifier
 */
export const handleThrowError = (error: unknown, prefix: string = 'LOG'): never => {
  // error is a legit Error
  if (error instanceof Error) {
    const msg = `[${prefix}] ${error.message}`
    throw new Error(msg, { cause: error })
  }

  if ( // error is an Object
    typeof error === 'object' &&
    error !== null &&
    'message' in error
  ) {
    throw new Error(
      `[${prefix}] ${error.message}`,
      { cause: error },
    )
  }

  if ( // error is an Object with an inner "error" object
    typeof error === 'object' &&
    error !== null &&
    'error' in error
  ) {
    const { error: innerError } = error
    const { message } = innerError as { message: string; http_code: number }

    throw new Error(
      `[${prefix}] ${message}`,
      { cause: error },
    )
  }

  const msgUnknown = `[${prefix}] An unknown error occured`
  throw new Error(msgUnknown, { cause: error })
}

/**
 * Logs an Error with log from calling function
 * @param error - Error object
 * @param prefix - Calling function identifier
 */
export const handleLogError = (error: unknown, prefix: string = 'LOG') => {
  if (error instanceof Error) {
    console.log(`[${prefix}] ${String(error.message)}`)
  } else if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error
  ) {
    console.log(`[${prefix}] ${String(error.message)}`)
  } else if (
    typeof error === 'object' &&
    error !== null &&
    'error' in error
  ) {
    const { error: innerError } = error
    const { message } = innerError as { message: string; http_code: number }
    console.log(`[${prefix}] ${message}`)
  } else {
    console.log(`[${prefix}] An unknown error occured`)
  }
}
