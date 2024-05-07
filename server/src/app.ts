import express from 'express';
import cors from 'cors';
import { noteRoute } from './routes/noteRoutes';
import { userRoute } from './routes/userRoutes';
import createHttpError from 'http-errors';
import morgan from 'morgan';
import session from 'express-session';
import { config } from 'dotenv';
import MongoStore from 'connect-mongo';
config();

export const app = express();

app.use(cors());
// app.use(
//   cors({
//     origin: '*',
//   })
// );
app.use(morgan('dev'));
app.use(express.json());
// app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.disable('x-powered-by'); // less hackers know about our stack
app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: `${process.env.DB_URI}`,
    }),
  })
);

//  displaying welcome message
app.get('/', (req, res) => {
  res.send({
    message: 'Welcome here!',
  });
});

app.use('/api/v1/users', userRoute);
app.use('/api/v1/notes', noteRoute);

app.use((req, res, next) => {
  next(createHttpError(404, 'Endpoint not found'));
});
