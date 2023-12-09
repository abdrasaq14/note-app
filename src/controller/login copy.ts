import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import bcrypt from "bcrypt";
import { error } from "console";
import { Session, SessionData } from "express-session";
import jwt from "jsonwebtoken";
import path from "node:path";
import { AuthenticatedRequest } from "../../express";

const sqlite3 = require("sqlite3").verbose();

// my database
const mydpPath = path.resolve(__dirname, "../", "usersAndNote.db");
const db = new sqlite3.Database(
  mydpPath,
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err) return console.log(err);
  }
);

// Zod to validate
const userSchema = z.object({
  email: z
    .string({
      required_error: "email needs to be provided",
      invalid_type_error: "email needs to be a string",
    })
    .email(),
  password: z
    .string({
      required_error: "password needs to be provided",
      invalid_type_error: "password needs to be a string",
    })
    .min(6, "password must be at least 6 characters"),
});
const strictNewUserSchema = userSchema.strict();
export async function userLogin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const validation = strictNewUserSchema.parse(req.body);
    const { email, password } = validation;

    // checking the database for the record of that user
    const sql = `SELECT * FROM Users WHERE Email = ?;`;
    //   this is now an array of object for each record
    const userDetailFromDatabase: Record<string, any> = {};
    const selectEmailFromDatabase: Record<string, any>[] = await new Promise(
      (resolve, reject) => {
        db.all(sql, [email], (err: Error, users: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(Object.assign(userDetailFromDatabase, ...users));
          }
        });
      })
      
      ;

    
    //unauthorized, kindly sign up or request access from admin;
    if (userDetailFromDatabase.Email !== email) {
      return res.render("login", {noSuchUserError: `User with email ${email} does not exist, Kindly login`})

    }
    else{
    //   if that user exist, check for password
    const matchPassword = await bcrypt.compare(
      password,
      userDetailFromDatabase.Password
    );
    if (!matchPassword) {

      const invalidPassword = `Invalid password, retry again`
      res.render("login", { invalidPassword})
    } else {
      const token = jwt.sign(
        { userId: userDetailFromDatabase.UserId },
        "your-secret-key",
        { expiresIn: "1h" }
        
      );
      res.cookie('authorization', `Bearer ${token}`, { httpOnly: true });
      const success = `user with ${email} successfully logged in`
      res.render("login", { success});
      //res.redirect('/notes/create')
      

      
    }
    

    }

  } catch (error) {
    if (error instanceof ZodError) {
      const zodErrorMessage =  error.issues.map((issue) => issue.message)
      res.render("login", { zodError: zodErrorMessage})

    } else if(error) {

      res.render("login", { error})

    }
  }
}
