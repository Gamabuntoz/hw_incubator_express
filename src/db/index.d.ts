import {usersType} from "./types";

declare global {
    declare namespace Express {
        export interface Request {
            user: usersType | null
        }
    }
}