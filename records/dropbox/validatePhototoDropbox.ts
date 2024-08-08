import sharp from 'sharp';
import { ValidationError } from '../../utils/errors';
import { checkDropboxSpaceUsage } from './checkDropboxSpaceUsage';

export async function validatePhoto(file: Express.Multer.File): Promise<void> {
  // Allowed file formats (mime types)
  const allowedMimeTypes = ['image/jpeg', 'image/png'];
  // Maximum file size in bytes (2 MB)
  const maxSize = 2 * 1024 * 1024;
  // Maximum allowed dimensions for the image (800x600 pixels)
  const maxWidth = 800;
  const maxHeight = 800;

  await checkDropboxSpaceUsage();

  // Check if the file format is allowed
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new ValidationError('Only JPG and PNG files are allowed.');
  }

  // Check if the file size exceeds the maximum allowed size
  if (file.size > maxSize) {
    throw new ValidationError('The file size exceeds the maximum limit of 2mb');
  }

  // Use the 'sharp' library to read the image's metadata
  const image = sharp(file.buffer);
  const metadata = await image.metadata();

  // Check if the image dimensions exceed the maximum allowed dimensions
  if (metadata.width > maxWidth || metadata.height > maxHeight) {
    throw new ValidationError(
      `The image dimensions exceed the allowed size of ${maxWidth}x${maxHeight} px.`
    );
  }
}
