import { Dropbox } from 'dropbox';
import { refreshAccessToken } from './refreshAccessToken';
import { ValidationError } from '../../utils/errors';

export async function deletePhotoFromDropbox(photo_id: string): Promise<void> {
  // Refresh the access token
  const accessToken = await refreshAccessToken();
  const dbx = new Dropbox({ accessToken, fetch });

  // Delete the file from Dropbox
  const response = await dbx.filesDeleteV2({
    path: photo_id,
  });

  if (!response) {
    throw new ValidationError('Failed to delete photo');
  }
}
