import express, { Request, Response, NextFunction } from "express";
const sqlite3 = require("sqlite3").verbose();
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';

// my database
const mydpPath = path.resolve(__dirname, "../../../", "model/usersAndNote.db");
const db = new sqlite3.Database(
  mydpPath,
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err) return console.log(err);
  }
);

export function getAllUserDetail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sql = `SELECT * FROM Users`;

  db.all(sql, function (err: Error, users: any[]) {
    if (err) {
      console.error("Error in database operation:", err);
      return res.status(500).json({
        status: 500,
        success: false,
        error: err.message, // Provide the error message for better debugging
      });
    } else {
      console.log("All users detail gotten");
      return res.send(JSON.stringify(users, null, 2));
    }
  });
}
export function renderSignupPage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.render("signup");
}
