// import dotenv from "dotenv";
// import path from "path";
// dotenv.config({ path: path.resolve("config/.env.local") })

import express from 'express';
import { bootstrap } from './app.controller.js';
import schedule from 'node-schedule';
import { User } from './DB/models/user.model.js';
import { deleteFolder } from './utils/cloud/cloudinary.config.js';


schedule.scheduleJob("1 */5 * * * *",
    async () => {
        const users = await User.find({ deletedAt: { $lte: Date.now() - 5 * 60 * 1000 } })
        for (const user of users) {
            await deleteFolder({ folder: `saraha_app/user/${user._id}` });
        }
        await User.deleteMany({ _id: { $in: users.map(user => user._id) } });
        console.log("deleted");
    });
const app = express();
const port = process.env.PORT;
bootstrap({ app, express });

app.listen(port, () => {
    console.log(`Server is running on port :${port}`);
});