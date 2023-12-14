import { token } from 'morgan';
import { AuthenticatedRequest } from '../../express'; 
import { Request, Response, NextFunction } from 'express';


export function noCache(req:AuthenticatedRequest, res:Response, next:NextFunction) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
  }