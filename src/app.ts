import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import {blogsCommandsRouter} from "./blogs/blogs-commands-router";
import {blogsQueryRouter} from "./blogs/blogs-query-router";
import {postsCommandRouter} from "./posts/posts-command-router";
import {postsQueryRouter} from "./posts/posts-query-router";
import {testingRouter} from "./DELETE-ALL-DATA/testing-router";
import {usersRouter} from "./users/users-router";
import {authRouter} from "./auth/auth-router";
import {commentsRouter} from "./comments/comments-router";
import {devicesRouter} from "./devices/devices-router";

const app = express()
const parserMiddleware = express.json()
app.set('trust proxy', true)
app.use(cors({}))
app.use(parserMiddleware)
app.use(cookieParser())
app.use("/blogs", blogsCommandsRouter)
app.use("/blogs", blogsQueryRouter)
app.use("/posts", postsCommandRouter)
app.use("/posts", postsQueryRouter)
app.use("/testing", testingRouter)
app.use("/users", usersRouter)
app.use("/auth", authRouter)
app.use("/comments", commentsRouter)
app.use("/security", devicesRouter)

export default app