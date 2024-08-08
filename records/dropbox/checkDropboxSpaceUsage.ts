import { Dropbox } from 'dropbox';
import { refreshAccessToken } from './refreshAccessToken';
import { ValidationError } from '../../utils/errors';

export async function checkDropboxSpaceUsage(): Promise<void> {
  const accessToken = await refreshAccessToken();
  const dbx = new Dropbox({ accessToken, fetch });

  // Get information about disk space usage
  const spaceUsage = await dbx.usersGetSpaceUsage();

  if (spaceUsage.result.allocation['.tag'] === 'individual') {
    const allocatedSpace: number = spaceUsage.result.allocation.allocated || 0;
    const usedSpace: number = spaceUsage.result.used || 0;

    // Check if uploading the file will exceed the 2 GB limit
    const remainingSpace = allocatedSpace - usedSpace;

    if (remainingSpace < 0) {
      throw new ValidationError('No space left in your Dropbox account.');
    }
  }
}
