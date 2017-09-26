import * as express from 'express'
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as jwt from 'jwt-express';
import * as helmet from 'helmet';
import * as auth from './middleware/auth';
import angular from './routes/Angular';
import * as api from './routes/api';

import { Request, Response, Application } from 'express';
import { SessionOptions } from "express-session";

const env:string = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';
const secret:string = process.env.cookieSecret || 'secret';

class App {
    public app:Application;

    constructor() {
        this.app = express();
        this.enableLogging();
        this.setupParsing();
        this.setupCookies(isProduction);
        this.enableSecurity(isProduction);
        this.mountRoutes();
    }

    private enableLogging(): void {
        this.app.use(morgan('short'));
        this.app.use(auth.logger(morgan));
    }

    private setupParsing(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private setupCookies(inProdMode:boolean): void {
        this.app.use(cookieParser(process.env.cookieSecret));
        this.app.use(jwt.init(process.env.jwtSecret, {
            cookieOptions: { httpOnly: false }
        }));

        let sessionConfig:SessionOptions = {
            secret: secret,
            resave: false,
            name: 'express-project-session',
            saveUninitialized: true,
        };

        if (inProdMode) {
            sessionConfig.cookie = {
                secure: true,
                httpOnly: true,
                domain: 'localhost',
                expires: new Date(Date.now() + 60 * 60 * 1000)
            };
        }

        this.app.use(session(sessionConfig));
    }

    private enableSecurity(inProdMode:boolean): void {
        if (inProdMode) {
            this.app.use(helmet());
        }
    }

    private mountRoutes(): void {
        this.app.use('/', angular);
        this.app.use('/api', api);
        this.app.use(function(req:Request, res:Response) {
            var error:Error = new Error('Not Found');
            res.status(404).json({
                status: 404,
                message: error.message,
                name: error.name
            });
        });
    }
}

export default new App().app