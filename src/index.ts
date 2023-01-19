import express from 'express'
import bodyParser from 'body-parser'
import {runDb} from "./repositories/db";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {testingRouter} from "./routes/testing-router";

export const app = express()
const port = process.env.PORT || 5000
const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing', testingRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Server start on port ${port}`)
    })
}

startApp()