import {BlogsCommandsRepository} from "./blogs/blogs-commands-repository";
import {BlogsService} from "./blogs/blogs-service";
import {BlogsCommandsController} from "./blogs/blogs-commands-controller";
import {BlogsQueryRepository} from "./blogs/blogs-query-repository";
import {BlogsQueryController} from "./blogs/blogs-query-controller";

const blogsCommandsRepository = new BlogsCommandsRepository()
const blogsService = new BlogsService(blogsCommandsRepository)
export const blogsCommandsController = new BlogsCommandsController(blogsService)

const blogsQueryRepository = new BlogsQueryRepository()
export const blogsQueryController = new BlogsQueryController(blogsQueryRepository)
