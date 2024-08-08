import { Router } from 'express';
import multer from 'multer';
import { Dropbox, DropboxResponseError } from 'dropbox';
import { EventPhotoRecord } from '../records/eventPhoto.record';
import { ValidationError } from '../utils/errors';
import { refreshAccessToken } from '../utils/refreshAccessTokenDbx';
import { uploadFileToDropbox } from '../utils/uploadFileToDropbox';
import { generateDirectDownloadLink } from '../utils/generateDirectDownloadLink';

export const eventsPhotos = Router();

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

eventsPhotos
  .get('/:event_id', async (req, res) => {
    try {
      const { event_id } = req.params;
      const photos = await EventPhotoRecord.getAll(event_id);

      if (!photos) {
        throw new ValidationError('There is no photos');
      }

      res.json(photos);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  })

  //Dropbox
  .post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('There is no file to send');
    }

    try {
      // Refresh the access token
      const accessToken = await refreshAccessToken();

      // Initialize Dropbox client with the new token
      const dbx = new Dropbox({ accessToken, fetch });

      // Upload the file to Dropbox
      const uploadResponse = await uploadFileToDropbox(dbx, req.file);

      // Generate a direct download link
      const directDownloadLink = await generateDirectDownloadLink(
        dbx,
        uploadResponse
      );

      //  Save photo metadata to the database
      const photo = new EventPhotoRecord({
        photo_id: uploadResponse.id,
        event_id: req.body.event_id,
        photo_url: directDownloadLink,
        photo_title: uploadResponse.name,
        photo_description: req.body.description,
      });

      await photo.insert();
      res.status(201).json(photo);
      return photo;
    } catch (error) {
      console.error('Error during file upload or database operation:', error);
      res
        .status(500)
        .send('An error occurred while uploading the file or saving metadata.');
    }
  })

  .delete('/delete/:photo_id', async (req, res) => {
    const { photo_id } = req.params;

    try {
      //Delete photo from data base
      const databasePhoto = await EventPhotoRecord.getOne(photo_id);

      if (!databasePhoto) {
        throw new ValidationError('No such photo');
      }

      await databasePhoto.delete();

      /* Delete photo from Dropbox */
      const accessToken = await refreshAccessToken();
      const dbx = new Dropbox({ accessToken, fetch });

      // Delete the file from Dropbox
      const response = await dbx.filesDeleteV2({
        path: photo_id,
      });

      if (!response) {
        throw new ValidationError('Failed to delete photo');
      }

      res.status(200).json({
        message: 'Photo deleted successfully from database and Dropbox',
        deletedPhoto: databasePhoto,
      });
    } catch (error) {
      if (error instanceof DropboxResponseError && error.status === 409) {
        console.error('Conflict error:', error.error);
      } else {
        console.error('Error deleting photo from Dropbox:', error);
      }
      res.status(500).json({
        message: 'Error deleting photo from Dropbox',
        error: error.message,
      });
    }
  });
