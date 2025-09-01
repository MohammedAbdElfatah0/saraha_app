import { rateLimit } from 'express-rate-limit';
import { connectDB } from './DB/connects.js';
import { authRouter, messageRouter, userRouter } from './modules/index.js';
import { globalErrorHandle } from './utils/error/index.js';
export const bootstrap = ({ app, express }) => {
    //handle rate limit 
    const limiter = rateLimit({
        windowMs: 60 * 1000, //1min
        limit: 3,
        handler: (req, res, next, options) => {
            throw new Error(options.message, { cause: options.statusCode });
        },
        legacyHeaders: false,
        skipSuccessfulRequests:true,
        identifier:(req,res,next)=>{
            return req.ip;
        }
    })
    app.use(limiter);


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