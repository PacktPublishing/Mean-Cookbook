import app from './App'
import * as db from './database';

const port:number = Number(process.env.PORT) || 3000;

app.listen(port, (error:Error) => {
    if (error) {
        return console.log(error)
    }

    return console.log(`server is listening on ${port}`)
});
