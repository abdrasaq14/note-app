import createError from "http-errors";
import express, {
  Request as ExpressRequest,
  Request,
  Response,
  NextFunction,
} from "express";
import { ZodError, z } from "zod";
import bcrypt from "bcrypt";
import path from "node:path";

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

// new user schema
const newUserSchema = z.object({
  fullname: z
    .string({
      required_error: "fullname needs to be provided",
      invalid_type_error: "fullname needs to be a string",
    })
    .trim()
    .min(2, "fullname need to have a min length of 2")
    .max(50, "fullname need to have a max length of 50"),
  email: z
    .string({
      required_error: "email needs to be provided",
      invalid_type_error: "email needs to be a string",
    })
    .email(),
  gender: z.string().max(1),
  phone: z.string().max(14),
  address: z.string().min(10).max(100),
  password: z
    .string({
      required_error: "password needs to be provided",
      invalid_type_error: "pass needs to be a string",
    })
    .min(6, "password must be at least 6 characters"),
});
const strictNewUserSchema = newUserSchema.strict();

export async function signupUserFunction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validation = strictNewUserSchema.parse(req.body);
    const { fullname, gender, email, phone, address, password } = validation;
    // Check for duplicate email
    const sql = `SELECT Email FROM Users`;
    const selectEmailFromDatabase: Record<string, string>[] = await new Promise(
      (resolve, reject) => {
        db.all(sql, (error: Error, users: any[]) => {
          if (error) {
            reject(error);
          } else {
            resolve(users);
          }
        });
      }
    );
    //res.render("signup", { selectEmailFromDatabase})
    const checkDuplicateemail = selectEmailFromDatabase.find(
      (element: Record<string, string>) => element.Email === email
    );
    // checking if the email already exists
    if (checkDuplicateemail) {
      res.render("signup", {
        EmailExistError: `User with ${email} already exist`,
      });
    } else {
      // Encrypt password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Store the new user
      const insertSql = `INSERT INTO Users (
         Full_name, 
         Gender, 
         Email, 
         Phone_no, 
         Address,
         Password
         ) 
         VALUES (?,?,?,?,?,?)`;
      const insertUserDetailIntoDatabase = await new Promise(
        (resolve, reject) => {
          db.run(
            insertSql,
            [fullname, gender, email, phone, address, hashedPassword],
            function (err: Error) {
              if (err) {
                // return `Error in database operation: ${err}`;
                reject(err);
              } else {
                
                resolve(`New User with ${email} created`);
              }
            }
          );
        }
      );
      res.render("signup", {
        insertUserDetailIntoDatabase: insertUserDetailIntoDatabase,
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const zodErrorMessage = error.issues.map((issue) => issue.message);
      res.render("signup", { zodError: zodErrorMessage });
    } else if (error) {
      res.render("signup", { databaseError: error });
    }
  }
}
