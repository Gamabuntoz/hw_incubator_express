import {runDb} from "./db/db";
import app from "./app";

const port = process.env.PORT || 5000


const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Server start on port ${port}`)
    })
}

startApp()