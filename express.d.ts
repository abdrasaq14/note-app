import { Request } from "express";
export interface AuthenticatedRequest extends Request{
    user?: { UserId: string}; // Adjust the properties according to your user object
    token?: {userToken: string}; // Adjust the properties according to your user object
    jwtSecret? :{secretKey: string};
    newUserId?: { UserId: string}
    session: Session & Partial<SessionData> & { token?: string };
  }