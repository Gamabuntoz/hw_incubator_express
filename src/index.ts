import express from "express"
import bodyParser from "body-parser"
import {runDb} from "./db/db";
import {blogsCommandsRouter} from "./blogs/blogs-commands-router";
import {postsCommandRouter} from "./posts/posts-command-router";
import {testingRouter} from "./DELETE-ALL-DATA/testing-router";
import {blogsQueryRouter} from "./blogs/blogs-query-router";
import {postsQueryRouter} from "./posts/posts-query-router";
import {usersRouter} from "./users/users-router";
import {authRouter} from "./auth/auth-router";
import {commentsRouter} from "./comments/comments-router";
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