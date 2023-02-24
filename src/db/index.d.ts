import {usersType} from "./DB-types";

declare global {
    declare namespace Express {
        export interface Request {
            user: usersType | null
        }
    }
}