import express, { Request, Response } from "express";
import { Cookie } from "express-session";


export function clearCookieOnLogout(req:Request, res:Response){
    req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
        else{
            // this will redirect to the homepage
            res.redirect('/');
        }
        // Redirect to the login page or any other desired page
        
      });
}