import { connectDB } from './DB/connects.js';
import { authRouter, messageRouter, userRouter } from './modules/index.js';

export const bootstrap = ({app,express})=>{
    //parse  req body [raw json]
    app.use(express.json());

    app.use("/auth",authRouter);
    app.use("/message",messageRouter);
    app.use("/user",userRouter);

    //
    connectDB();
};