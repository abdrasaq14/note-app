import { AuthenticatedRequest } from '../../express'; 
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import path from 'node:path'

const sqlite3 = require("sqlite3").verbose();
// my database
const mydpPath = path.resolve(__dirname, "../../../", "model/usersAndNote.db");
const db = new sqlite3.Database(
  mydpPath,
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err) return console.log(err);
  }
);

async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction){
  // @ts-ignore
  const token = req.session.token || req.headers.authorization?.replace('Bearer ', '') || req.headers.Authorization?.replace('Bearer ', '');
  if (!token) {
    return res.redirect("../users/login");
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key') as { userId: string };
    const queryUser = `SELECT UserId FROM Users WHERE UserId = ?`; 
    const userIdFromDatabase:Record<string, string> = {}
    const selectedUserId: Record<string, string>[] = await new Promise((resolve, reject)=>{
        db.all(queryUser, [decoded.userId], (err:Error, userReturned:Record<string, string>[])=>{
            if(err){
                reject(res.status(500).json({
                    message: `userId not found`
                }))
            }
            else{
                resolve(Object.assign(userIdFromDatabase, ...userReturned)) 
            }
        })
    });

    if (!userIdFromDatabase) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    else{
      // get userid from the login and passing to the next function
      req.user = { UserId: userIdFromDatabase.UserId }; // Attach the user to the request for further use
      
    next();
  }
    
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export { authenticate }