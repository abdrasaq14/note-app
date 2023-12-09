"use strict";
// import express, { Request, Response, NextFunction } from "express";
// import { ZodError, z } from "zod";
// import { AuthenticatedRequest } from "../../express";
// import url from "node:url";
// import path, { resolve } from "node:path";
// import { title } from "node:process";
// import { rejects } from "node:assert";
// import jwt from 'jsonwebtoken'
// //const jwtSecret = process.env.JWT_SECRET!;
// // my database
// const mydpPath = path.resolve(__dirname, "../", "usersAndNote.db");
// const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database(
//   mydpPath,
//   sqlite3.OPEN_READWRITE,
//   (err: any) => {
//     if (err) return err;
//   }
// );
// /* GET ALL NOTES listing (HOMEPAGE). */
// export async function getNoteFunction(req: Request, res: Response, next: NextFunction) {
//   const sql = `SELECT * FROM Notes`;
//   try {
//     const notes = await new Promise<any[]>((resolve, reject) => {
//       db.all(sql, function (err: Error, notes: any[]) {
//         if (err) {
//           reject(err); // Reject with the error
//         } else {
//           resolve(notes); // Resolve with the data
//         }
//       });
//     });
//     res.render("getAllNotes", { notes });
//   } catch (error) {
//     res.render("getAllNotes", { error }); // Render an error message
//   }
// }
// /* GET ALL NOTES listing (HOMEPAGE). */
// export async function getIndividualNoteFunction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
//   try {
//     const token = req.session.token || req.headers.authorization?.replace('Bearer ', '')
//     const sql = `SELECT * FROM Notes WHERE UserId = ?`;
//     const userId = req.user?.UserId;
//     const notes = await new Promise<any[]>((resolve, reject) => {
//       db.all(sql, [userId], function (err: Error, notes: any[]) {
//         if (err) {
//           reject(err); // Reject with the error
//         } else {
//           resolve(notes); // Resolve with the data
//         }
//       });
//     });
//     console.log("this", notes)
//     res.render("dashboard", { notes });
//     req.user = { UserId: userId! };
//     localStorage.setItem('mytoken', token)
//     req.session = {token: token} // Attach the user to the request for further use
//     next()
//   } catch (error) {
//     res.render("dashboard", { error }); // Render an error message
//   }
// }
// // zod to validate new input
// const notesObjectSchema = z.object({
//   Title: z
//     .string({
//       required_error: "Title needs to be provided",
//       invalid_type_error: "Title needs to be a string",
//     })
//     .trim()
//     .min(2, "Title need to have a min length of 2")
//     .max(200, "Title need to have a max length of 200"),
//   Description: z.string(),
//   DueDate: z.string().trim(),
//   Status: z
//     .string({
//       required_error: "kindly indicate the status",
//     })
//     .max(14),
// });
// const strictNoteObjectSchema = notesObjectSchema.strict();
// // new note middle control
// export const createNewNoteFunction = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     //const userId = req.user?.UserId;
//     console.log("hjg",req.body);
//     const validation = strictNoteObjectSchema.parse(req.body);
//     const { Title, Description, DueDate, Status } = validation;
//     /*getting the user id from the authenticate middleware so
//     that the current userid can be append to the note created*/
//     const userId = req.user?.UserId;
//     const sql = `INSERT INTO Notes (
//     Title, 
//     description, 
//     DueDate, 
//     Status,
//     UserId
//     ) 
//     VALUES (?,?,?,?,?)`;
//   if(userId === undefined){
//     const undefinedUserId = `userId undefined, I don't know how you get here`;
//     //res.lorender("dashboard", { undefinedUserId })
//   console.log(userId);
//   }
//   else{
//     const createNewNote = await new Promise((resolve, reject)=>{
//       db.run(
//         sql,
//         [Title, Description, DueDate, Status, userId],
//         function (err: Error) {
//           if (err) {
//             reject(err)
//           } else {
//             resolve(`new note with ${Title} and ${Description} created successfully`)
//             const token = req.session.token;
//             //req.newUserId = { UserId: userId}
//             res.redirect("http://localhost:3000/notes/dashboard")
//             // return res.status(200).json({
//             //   message: "New note created successfully",
//             // });
//           }
//         }
//       );
//     })
//     //res.redirect("http://localhost:3000/notes/dashboard")
//     //res.render("dashboard", { createNewNote })
//   }
//   // const getCreatedNote = `SELECT * FROM Notes WHERE UserId = ?`;
//   //   const notes = await new Promise<any[]>((resolve, reject) => {
//   //     db.all(getCreatedNote, [userId], function (err: Error, notes: any[]) {
//   //       if (err) {
//   //         reject(err); // Reject with the error
//   //       } else {
//   //         resolve(notes); // Resolve with the data
//   //       }
//   //     });
//   //   });
//   //   res.render("notes", { notes });
//   } catch (error) {
//     if (error instanceof ZodError) {
//       const zodErrorMessage =  error.issues.map((issue) => issue.message)
//       //res.render("dashboard", { zodError: zodErrorMessage})
//       // res.status(401).json({
//       //   message: error
//       // });
//     } else if(error) {
//       //res.render("dashboard", { error})
//       // return res.status(403).json({
//       //   error: "Kindly sign up or request access from admin",
//       // });
//     }
//   }
// };
// // zod to validate new input
// const putNotesObjectSchema = z.object({
//   title: z
//     .string({
//       required_error: "Title needs to be provided",
//       invalid_type_error: "Title needs to be a string",
//     })
//     .trim()
//     .min(2, "Title need to have a min length of 2")
//     .max(200, "Title need to have a max length of 200"),
//   description: z.string(),
//   dueDate: z.string().trim(),
//   status: z
//     .string({
//       required_error: "kindly indicate the status",
//     })
//     .max(14),
// });
// //const strictPutNotesObjectSchema = putNotesObjectSchema.strict();
// // new note middle control
// export const putNewNoteFunction = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     //const userId = req.user?.UserId;
//     //const { query } = url.parse(req.url as string, true);
//     // if (!query.noteId) {
//     //   res.status(400).json({
//     //     message: "Kindly supply noteid to update",
//     //   });
//     //} else {
//       const validation = putNotesObjectSchema.parse(req.body);
//       const { title, description, dueDate, status } = validation;
//       // this is from the form on dashboard
//       const noteId = req.body.noteId
//       const sql = `UPDATE Notes SET Title = ?, Description = ?, DueDate = ?, Status =? WHERE NoteId = ${noteId}`;
//       const insertUpdateNote = await new Promise((resolve, reject)=>{
//         db.run(
//           sql,
//           [title, description, dueDate, status],
//           function (err: Error) {
//             if (err) {
//               reject(err);
//             } else {
//               resolve(`note updated successfully`);
//               //req.jwtSecret = {secretKey: jwtSecret}
//               const token = req.session.token;
//               res.redirect("http://localhost:3000/notes/dashboard")
//             }
//           }
//         );
//       })
//       // req.token = {userToken: `Bearer ${token}`}
//       //res.redirect("http://localhost:3000/notes/create")
//       //res.render("dashboard", { insertUpdateNote })
//     //}
//   } catch (error) {
//     if (error instanceof ZodError) {
//       const zodErrorMessage =  error.issues.map((issue) => issue.message)
//       res.render("login", { zodError: zodErrorMessage})
//     } else if(error) {
//       res.render("dashboard", { error})
//     }
//   }
// };
// // DELETE NOTE 
// export async function deleteNoteFunction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
//   try {
//     const { noteId } = req.body;
//     const sql = `DELETE FROM Notes WHERE NoteCode = ?`;
//     const deletedNotes = await new Promise((resolve, reject) => {
//       db.run(sql, [noteId], function (err: Error) {
//         if (err) {
//           reject(err); // Reject with the error
//         } else {
//           resolve(`note with ${noteId} deleted successfully`); // Resolve with the data
//         }
//       });
//     });
//     res.render("dashboard", { deletedNote: deletedNotes });
//     // Attach the user to the request for further use
//   } catch (error) {
//     res.render("dashboard", { deletingError: error }); // Render an error message
//   }
// }
