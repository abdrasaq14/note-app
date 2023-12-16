import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import { AuthenticatedRequest } from "../../express";
import path from "node:path";
import { generateUUID } from "./uuidFunction";
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
/* GET ALL NOTES listing (HOMEPAGE). */

export async function getNoteFunction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sql = `SELECT * FROM Notes`;

  try {
    const notes = await new Promise<any[]>((resolve, reject) => {
      db.all(sql, function (err: Error, notes: any[]) {
        if (err) {
          reject(err); // Reject with the error
        } else {
          resolve(notes); // Resolve with the data
        }
      });
    });

    res.render("notes", { notes });
  } catch (error) {
    res.render("notes", { error }); // Render an error message
  }
}

/* GET ALL NOTES listing (HOMEPAGE). */

export async function getIndividualNoteFunction(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const sql = `SELECT * FROM Notes WHERE UserId = ?`;
  const nameSql = `SELECT * FROM Users WHERE UserId = ?`;
  try {
    const userId = req.user?.UserId;
    const notes = await new Promise<any[]>((resolve, reject) => {
      db.all(sql, [userId], function (err: Error, notes: any[]) {
        if (err) {
          reject(err); // Reject with the error
        } else {
          resolve(notes); // Resolve with the data
        }
      });
    });
    //res.render("dashboard", { notes });
    const queryUserTable = await new Promise<any[]>((resolve, reject) => {
      db.all(nameSql, [userId], function (err: Error, users: any[]) {
        if (err) {
          reject(err); // Reject with the error
        } else {
          resolve(users); // Resolve with the data
        }
      });
    });

    const token = req.session.token;
    res.render("dashboard", { notes, queryUserTable });

    next();
  } catch (error) {
    res.render("dashboard", { error }); // Render an error message
  }
}

// zod to validate new input
const notesObjectSchema = z.object({
  Title: z
    .string({
      required_error: "Title needs to be provided",
      invalid_type_error: "Title needs to be a string",
    })
    .trim()
    .min(2, "Title need to have a min length of 2")
    .max(200, "Title need to have a max length of 200"),
  Description: z.string(),
  DueDate: z.string().trim(),
  Status: z
    .string({
      required_error: "kindly indicate the status",
    })
    .max(14),
});
const strictNoteObjectSchema = notesObjectSchema.strict();

// new note middle control
export const createNewNoteFunction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = strictNoteObjectSchema.parse(req.body);
    const { Title, Description, DueDate, Status } = validation;
    /*getting the user id from the authenticate middleware so
    that the current userid can be append to the note created*/

    const userId = req.user?.UserId;
    const generateNoteID = generateUUID().slice(9, 13);
    const sql = `INSERT INTO Notes (
      NoteId,
      Title,
      Description, 
      DueDate, 
      Status,
      UserId
    ) 
    VALUES (?,?,?,?,?,?)`;

    if (userId === undefined) {
      const undefinedUserId = `userId undefined, I don't know how you get here`;

      console.log(userId);
    } else {
      const createNewNote = await new Promise((resolve, reject) => {
        db.run(
          sql,
          [generateNoteID, Title, Description, DueDate, Status, userId],
          function (err: Error) {
            if (err) {
              reject(err);
            } else {
              resolve(
                `new note with ${Title} and ${Description} created successfully`
              );
              const token = req.session.token;
              req.newUserId = { UserId: userId };
              res.redirect("/notes/dashboard");
              next();
            }
          }
        );
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const zodErrorMessage = error.issues.map((issue) => issue.message);
    } else if (error) {
    }
  }
};

// zod to validate new input
const putNotesObjectSchema = z.object({
  Title: z
    .string({
      required_error: "Title needs to be provided",
      invalid_type_error: "Title needs to be a string",
    })
    .trim()
    .min(2, "Title need to have a min length of 2")
    .max(200, "Title need to have a max length of 200"),
  Description: z.string(),
  DueDate: z.string().trim(),
  Status: z
    .string({
      required_error: "kindly indicate the status",
    })
    .max(14),
});
//const strictPutNotesObjectSchema = putNotesObjectSchema.strict();

// new note middle control
export const putNewNoteFunction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = putNotesObjectSchema.parse(req.body);
    const { Title, Description, DueDate, Status } = validation;
    const noteId = req.body.noteId;

    const sql = `UPDATE Notes 
    SET
      Title = ?,
      Description = ?,
      DueDate = ?,
      Status = ?
    WHERE
      NoteId = ?`;

    const insertUpdateNote = await new Promise((resolve, reject) => {
      db.run(
        sql,
        [Title, Description, DueDate, Status, noteId],
        function (err: Error) {
          if (err) {
            reject(err);
          } else {
            resolve(`note updated successfully`);
            //req.jwtSecret = {secretKey: jwtSecret}
            const token = req.session.token;

            res.redirect("/notes/dashboard");
          }
        }
      );
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const zodErrorMessage = error.issues.map((issue) => issue.message);
      res.render("dashboard", { zodError: zodErrorMessage });
    } else if (error) {
      res.render("dashboard", { error });
    }
  }
};

export async function deleteNoteFunction(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { noteCode } = req.body;
    const sql = `DELETE FROM Notes WHERE NoteCode = ?`;

    const deletedNotes = await new Promise((resolve, reject) => {
      db.run(sql, [noteCode], function (err: Error) {
        if (err) {
          reject(err); // Reject with the error
        } else {
          resolve(`note with ${noteCode} deleted successfully`); // Resolve with the data
        }
      });
    });

    res.render("dashboard", { deletedNote: deletedNotes });
    // Attach the user to the request for further use
  } catch (error) {
    res.render("dashboard", { deletingError: error }); // Render an error message
  }
}
