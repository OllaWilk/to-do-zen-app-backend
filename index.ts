import express, { json } from 'express';
import cors from 'cors';
import methodOverride from 'method-override';

import { urlencoded } from 'express';
import 'express-async-errors';
import { handleError } from './utils/errors';
import { eventsRouter } from './routes/events.routes';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(json());

app.use(methodOverride('_method'));
app.use(urlencoded({ extended: true }));

app.use('/events', eventsRouter);
app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
  console.log('Listening on port http://localhost:3001');
});
