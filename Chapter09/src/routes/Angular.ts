import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import {NextFunction, Request, Response, Router} from "express";
import * as cheerio from 'cheerio';
import * as expressStaticGzip from 'express-static-gzip';

class AngularRoute {
    public route: Router;
    private angularBuildPath: string;
    private indexPage: CheerioStatic;

    constructor() {
        this.route = express.Router();
        this.angularBuildPath = path.resolve(__dirname, 'angular');
        this.indexPage = this.getIndexPage(this.angularBuildPath);
        this.enableGzipCompression();
        this.route.get('*', this.serveRoute.bind(this));
    }

    getIndexPage(pathToAngular:string): CheerioStatic {
        const indexFile =  fs.readFileSync(
            path.join(pathToAngular, 'index.html'),
            {encoding: "utf8"});

        return cheerio.load(indexFile);
    }

    getRequestLocale(req:Request):string {
        const acceptLanguage = req.get('Accept-Language') || 'en-us,en';
        return acceptLanguage.split(',')[0];
    }

    getIndexWithLocale(locale:string):string {
        this.indexPage('head script').html('document.locale = "' + locale + '"');
        return this.indexPage.html()
    }

    enableGzipCompression() {
        this.route.use(expressStaticGzip(this.angularBuildPath));
    }

    serveRoute(req: Request, res:Response, next:NextFunction) {
        if (req.url.startsWith('/api')) return next();

        const locale = this.getRequestLocale(req);
        res.contentType('text/html; charset=UTF-8');
        res.send(this.getIndexWithLocale(locale));
    }
}

export default new AngularRoute().route;