import express from 'express'
import bodyParser from 'body-parser'
import {runDb} from "./repositories/db";
import {blogsCommandRouter} from "./routes/blogs-routes/blogs-command-router";
import {postsCommandRouter} from "./routes/posts-routes/posts-command-router";
import {testingRouter} from "./routes/testing-router";

export const app = express()
const port = process.env.PORT || 5000
const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.use('/blogs-routes', blogsCommandRouter)
app.use('/posts-routes', postsCommandRouter)
app.use('/testing', testingRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Server start on port ${port}`)
    })
}

startApp()