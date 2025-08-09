import express from 'express';
import { bootstrap } from './app.controller.js';
const app = express();
const port = 3000;
bootstrap({ app, express });
app.listen(port, () => {
    console.log('Server is running on port :3000');
});