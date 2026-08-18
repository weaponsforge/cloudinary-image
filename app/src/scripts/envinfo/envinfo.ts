import { execSync } from 'child_process'

export const envinfo = () => {
  console.log('Node version:', process.version)
  console.log('Platform:', process.platform)
  console.log('Arch:', process.arch)
  console.log('V8 version:', process.versions.v8)

  try {
    console.log('npm version:', execSync('npm -v').toString().trim())
  } catch {
    console.log('npm version: unavailable')
  }
}

