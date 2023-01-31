import express from 'express'
import bodyParser from 'body-parser'
import {runDb} from "./repositories/db";
import {blogsCommandsRouter} from "./routes/blogs/blogs-commands-router";
import {postsCommandRouter} from "./routes/posts/posts-command-router";
import {testingRouter} from "./routes/DELETE-ALL-DATA/testing-router";
import {blogsQueryRouter} from "./routes/blogs/blogs-query-router";
import {postsQueryRouter} from "./routes/posts/posts-query-router";
import {usersRouter} from "./routes/users/users-router";
import {authRouter} from "./routes/auth/auth-router";
import {commentsRouter} from "./routes/comments/comments-router";
import cors from "cors"

export const app = express()
const port = process.env.PORT || 5000
const parserMiddleware = bodyParser({})

app.use(cors({}))
app.use(parserMiddleware)
app.use("/blogs", blogsCommandsRouter)
app.use("/blogs", blogsQueryRouter)
app.use("/posts", postsCommandRouter)
app.use("/posts", postsQueryRouter)
app.use("/testing", testingRouter)
app.use("/users", usersRouter)
app.use("/auth", authRouter)
app.use("/comments", commentsRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Server start on port ${port}`)
    })
}

startApp()