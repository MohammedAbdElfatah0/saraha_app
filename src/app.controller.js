import { connectDB } from './DB/connects.js';
import { authRouter, messageRouter, userRouter } from './modules/index.js';

import { globalErrorHandle } from './utils/error/index.js';
export const bootstrap = ({ app, express }) => {
    //parse  req body [raw json]
    app.use(express.json());

    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/message", messageRouter);
    //global error handler
    app.use(globalErrorHandle)
    //
    connectDB();
};