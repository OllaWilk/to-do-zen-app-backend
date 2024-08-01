import { Router } from 'express';
import multer from 'multer';
import { Dropbox } from 'dropbox';
import { EventPhotoRecord } from '../records/eventPhoto.record';
import { ValidationError } from '../utils/errors';
import { refreshAccessToken } from '../utils/refreshAccessTokenDbx';

export const eventsPhotos = Router();

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

eventsPhotos
  .get('/', async (req, res) => {
    try {
      const { event_id } = req.body;
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
      const dbx = new Dropbox({
        accessToken,
        fetch,
      });

      // Upload the file to Dropbox
      const response = await dbx.filesUpload({
        path: '/' + req.file.originalname, // The path where the file will be saved in Dropbox
        contents: req.file.buffer, // File content
      });

      console.log('File uploaded successfully:', response);
      res.status(200).send('Files uploaded to Dropbox');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error with sending to Dropbox');
    }
  });
