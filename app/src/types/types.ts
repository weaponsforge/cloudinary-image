import type { TransformationOptions, ConfigAndUrlOptions } from 'cloudinary'

// ----------------------------------------------------
// Base Image types
// ----------------------------------------------------

export interface ImageLocation {
  localFile: string;
  localDestination?: string;
  publicId?: string;
  cloudinaryAssetFolder?: string;
}

// ----------------------------------------------------
// File types
// ----------------------------------------------------

export interface File {
  allowed_formats: 'jpg' | 'jpeg' | 'png' | 'webp' | 'bmp' | 'gif' | 'avif';
  fetch_format: 'auto' | string;
}

export interface Filename {
  use_filename?: boolean;
  unique_filename?: boolean;
}

// ----------------------------------------------------
// Image Transformation types
// ----------------------------------------------------

export type TransformationParams = TransformationOptions | ConfigAndUrlOptions | undefined

export interface ImageSize {
  width?: number;
  height?: number;
}

export interface TransformOptionalParams {
  crop?: string;
  gravity?: string;
  quality?: string;
  fetch_format?: string;
}

export interface ImageCropOptions extends TransformOptionalParams {
  width: number;
  height: number;
}

export interface TransformOptions
  extends ImageSize, TransformOptionalParams {}

// Miscellaneous transformation types

export interface TransformationStyles {
  width?: number;
  height?: number;
  radius?: 'max' | number;
  border?: string; // eg., 10px_solid_rgb:bde4fb
  background?: 'auto' | string;
  effect?: string; // eg., tint:40:red, improve:outdoor, art:zorro
}

/*
export interface TransformationOptions extends TransformationStyles {
  crop?: CropOptions | string;
  gravity: string;                // eg., south_west
  quality: 'auto' | number;
  aspect_ratio: string;           // 16:9, etc
}
*/

export type CropOptions =
  'scale' | 'pad' | 'thumb' | 'fill'

// Value could also be an object name in the image
export type GravityOptions =
  'auto' | 'face' | 'auto' |
  'north' | 'north_east' | 'nort_west' |
  'south' | 'south_east' | 'south_west' |
  'east' | 'west'
