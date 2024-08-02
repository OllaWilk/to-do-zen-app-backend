import { Dropbox, files } from 'dropbox';

/**
 * Generates a direct download link by modifying the shared link.
 */
export async function generateDirectDownloadLink(
  dbx: Dropbox,
  uploadResponse: files.FileMetadata
): Promise<string> {
  const photoLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
    path: uploadResponse.path_lower as string,
  });
  return photoLinkResponse.result.url.replace('dl=0', 'raw=1');
}
