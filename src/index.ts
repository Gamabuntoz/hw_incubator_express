import express from 'express'
import bodyParser from 'body-parser'
import {runDb} from "./repositories/db";
import {blogsCommandsRouter} from "./routes/blogs-routes/blogs-commands-router";
import {postsCommandRouter} from "./routes/posts-routes/posts-command-router";
import {testingRouter} from "./routes/testing-router";
import {blogsQueryRouter} from "./routes/blogs-routes/blogs-query-router";
import {postsQueryRouter} from "./routes/posts-routes/posts-query-router";
import {usersRouter} from "./routes/users-router/users-router";
import {authRouter} from "./routes/auth-router";

export const app = express()
const port = process.env.PORT || 5000
const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.use('/blogs', blogsCommandsRouter)
app.use('/blogs', blogsQueryRouter)
app.use('/posts', postsCommandRouter)
app.use('/posts', postsQueryRouter)
app.use('/testing', testingRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Server start on port ${port}`)
    })
}

startApp()