import { Router } from 'express';
import multer from 'multer';
import { Dropbox } from 'dropbox';
import { EventPhotoRecord } from '../records/eventPhoto.record';
import { ValidationError } from '../utils/errors';

export const eventsPhotos = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
  fetch,
});

eventsPhotos
  .get('/', async (req, res) => {
    try {
      const { event_id } = req.body;
      const photos = await EventPhotoRecord.getAll(event_id);

      if (!photos) {
        throw new ValidationError('There is no photos');
      }

      res.json(photos);
      console.log(photos);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  })

  .post('/upload', upload.single('image'), async (req, res) => {
    if (req.file) {
      try {
        const response = await dbx.filesUpload({
          path: '/' + req.file.originalname,
          contents: req.file.buffer,
        });

        console.log(response);
        res.status(200).send('Files uploaded to Dropbox');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error with sending to Dropbox');
      }
    } else {
      res.status(400).send('there is no file to send');
    }
  });
