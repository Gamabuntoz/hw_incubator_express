import {client} from "./db";

export const usersCollection = client.db().collection("users")