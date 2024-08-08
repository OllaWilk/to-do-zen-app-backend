import { Dropbox } from 'dropbox';

/** Uploads the file to Dropbox and returns the upload response.*/

export async function uploadFileToDropbox(
  dbx: Dropbox,
  file: Express.Multer.File
) {
  const response = await dbx.filesUpload({
    path: '/' + file.originalname, // File path in Dropbox
    contents: file.buffer, // File content
  });
  return response.result;
}
