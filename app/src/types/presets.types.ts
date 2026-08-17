export interface UploadPresetOptions {
  name?: string;
  resource_type?: 'image' | 'auto' | 'video';
  unsigned?: boolean;
  tags: string;
}