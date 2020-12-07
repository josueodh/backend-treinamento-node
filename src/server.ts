import dotenv from "dotenv";
import 'reflect-metadata'

import express from 'express';
import routes from './routes';

dotenv.config();
import './database/index';


const app = express();

app.use(express.json());

app.use(routes);

app.listen(process.env.PORT || 3333, () => {
    console.log("Server started on port 3333");
});
