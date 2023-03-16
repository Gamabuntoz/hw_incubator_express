import {BlogsCommandsRepository} from "./blogs/blogs-commands-repository";
import {BlogsService} from "./blogs/blogs-service";
import {BlogsCommandsController} from "./blogs/blogs-commands-controller";

const blogsCommandsRepository = new BlogsCommandsRepository()
const blogsService = new BlogsService(blogsCommandsRepository)
export const blogsCommandsController = new BlogsCommandsController(blogsService)
