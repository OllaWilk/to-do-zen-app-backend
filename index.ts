import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import methodOverride from 'method-override';
import { urlencoded } from 'express';
import 'express-async-errors';
import { rateLimit } from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { handleError } from './utils/errors';
import { eventsRouter } from './routes/events.routes';
import { usersRouter } from './routes/users.routes';
import { eventsPhotos } from './routes/eventsPhotos.routers';
import { testDatabaseConnection } from './utils/testDatabaseConnection';

const app = express();
dotenv.config();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(json());
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000, //15 minutes
    max: 100, //Limit each IP to 100 request per 'window'
  })
);
app.use(methodOverride('_method'));
app.use(urlencoded({ extended: true }));

app.use('/user', usersRouter);
app.use('/events', eventsRouter);
app.use('/event/photos', eventsPhotos);
app.use(handleError);

const PORT = parseInt(process.env.PORT || '3001', 10);

async function startServer() {
  try {
    await testDatabaseConnection();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Listening on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Nie udało się połączyć', error);
  }
}

startServer();
