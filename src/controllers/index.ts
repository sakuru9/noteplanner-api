import { Response, Request } from "express";
import { login, user } from "./user";

const home = (req: Request, res: Response) => res.json();

export { home, user, login };
