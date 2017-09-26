import app from './App'
import * as Debug from 'debug';

const name = 'express:blog-app';
const debug = Debug(name);
debug('launching %s...', name);

import { mongooseConnection } from './Database';

const port:number = Number(process.env.PORT) || 3000;

app.listen(port, (error:Error) => {
    debug('listener registered on port %s', port);
    if (error) {
        return console.log(error)
    }

    return console.log(`server is listening on ${port}, mongodb:${mongooseConnection.db.databaseName}`)
});
