import dotenv from "dotenv";
import 'reflect-metadata'

import express from 'express';
import routes from './routes';
import cors from 'cors';

dotenv.config();
import './database/index';

const app = express();
app.use(cors);
app.use(express.json());

app.use(routes);

app.listen(process.env.PORT || 3333, () => {
    console.log("Server started on port 3333");
});
