import express, { Express } from 'express';
import dotenv from 'dotenv';

import indexRoutes from './routes/index';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use(indexRoutes);

app.listen(port, () => {
	console.log(`[server]: Server is running in ${port}`);
});
