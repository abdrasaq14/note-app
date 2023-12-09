"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNoteFunction = exports.putNewNoteFunction = exports.createNewNoteFunction = exports.getIndividualNoteFunction = exports.getNoteFunction = void 0;
const zod_1 = require("zod");
const node_path_1 = __importDefault(require("node:path"));
//const jwtSecret = process.env.JWT_SECRET!;
// my database
const mydpPath = node_path_1.default.resolve(__dirname, "../", "usersAndNote.db");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(mydpPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err)
        return err;
});
/* GET ALL NOTES listing (HOMEPAGE). */
function getNoteFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT * FROM Notes`;
        try {
            const notes = yield new Promise((resolve, reject) => {
                db.all(sql, function (err, notes) {
                    if (err) {
                        reject(err); // Reject with the error
                    }
                    else {
                        resolve(notes); // Resolve with the data
                    }
                });
            });
            res.render("notes", { notes });
        }
        catch (error) {
            res.render("notes", { error }); // Render an error message
        }
    });
}
exports.getNoteFunction = getNoteFunction;
/* GET ALL NOTES listing (HOMEPAGE). */
function getIndividualNoteFunction(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT * FROM Notes WHERE UserId = ?`;
        const nameSql = `SELECT * FROM Users WHERE UserId = ?`;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.UserId;
            const notes = yield new Promise((resolve, reject) => {
                db.all(sql, [userId], function (err, notes) {
                    if (err) {
                        reject(err); // Reject with the error
                    }
                    else {
                        resolve(notes); // Resolve with the data
                    }
                });
            });
            //res.render("dashboard", { notes });
            const queryUserTable = yield new Promise((resolve, reject) => {
                db.all(nameSql, [userId], function (err, users) {
                    if (err) {
                        reject(err); // Reject with the error
                    }
                    else {
                        resolve(users); // Resolve with the data
                    }
                });
            });
            const token = req.session.token;
            res.render("dashboard", { notes, queryUserTable });
            next();
        }
        catch (error) {
            res.render("dashboard", { error }); // Render an error message
        }
    });
}
exports.getIndividualNoteFunction = getIndividualNoteFunction;
// zod to validate new input
const notesObjectSchema = zod_1.z.object({
    Title: zod_1.z
        .string({
        required_error: "Title needs to be provided",
        invalid_type_error: "Title needs to be a string",
    })
        .trim()
        .min(2, "Title need to have a min length of 2")
        .max(200, "Title need to have a max length of 200"),
    Description: zod_1.z.string(),
    DueDate: zod_1.z.string().trim(),
    Status: zod_1.z
        .string({
        required_error: "kindly indicate the status",
    })
        .max(14),
});
const strictNoteObjectSchema = notesObjectSchema.strict();
// new note middle control
const createNewNoteFunction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validation = strictNoteObjectSchema.parse(req.body);
        const { Title, Description, DueDate, Status } = validation;
        /*getting the user id from the authenticate middleware so
        that the current userid can be append to the note created*/
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.UserId;
        const sql = `INSERT INTO Notes (
    Title, 
    description, 
    DueDate, 
    Status,
    UserId
    ) 
    VALUES (?,?,?,?,?)`;
        if (userId === undefined) {
            const undefinedUserId = `userId undefined, I don't know how you get here`;
            //res.lorender("dashboard", { undefinedUserId })
            console.log(userId);
        }
        else {
            const createNewNote = yield new Promise((resolve, reject) => {
                db.run(sql, [Title, Description, DueDate, Status, userId], function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(`new note with ${Title} and ${Description} created successfully`);
                        const token = req.session.token;
                        req.newUserId = { UserId: userId };
                        console.log(token);
                        res.redirect("/notes/dashboard");
                        next();
                        // return res.status(200).json({
                        //   message: "New note created successfully",
                        // });
                    }
                });
            });
        }
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const zodErrorMessage = error.issues.map((issue) => issue.message);
        }
        else if (error) {
        }
    }
});
exports.createNewNoteFunction = createNewNoteFunction;
// zod to validate new input
const putNotesObjectSchema = zod_1.z.object({
    title: zod_1.z
        .string({
        required_error: "Title needs to be provided",
        invalid_type_error: "Title needs to be a string",
    })
        .trim()
        .min(2, "Title need to have a min length of 2")
        .max(200, "Title need to have a max length of 200"),
    description: zod_1.z.string(),
    dueDate: zod_1.z.string().trim(),
    status: zod_1.z
        .string({
        required_error: "kindly indicate the status",
    })
        .max(14),
});
//const strictPutNotesObjectSchema = putNotesObjectSchema.strict();
// new note middle control
const putNewNoteFunction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = putNotesObjectSchema.parse(req.body);
        const { title, description, dueDate, status } = validation;
        const noteId = req.body.noteId;
        const sql = `UPDATE Notes SET Title = ?, Description = ?, DueDate = ?, Status =? WHERE NoteId = ${noteId}`;
        const insertUpdateNote = yield new Promise((resolve, reject) => {
            db.run(sql, [title, description, dueDate, status], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(`note updated successfully`);
                    //req.jwtSecret = {secretKey: jwtSecret}
                    const token = req.session.token;
                    res.redirect("/notes/dashboard");
                    next();
                }
            });
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const zodErrorMessage = error.issues.map((issue) => issue.message);
            res.render("login", { zodError: zodErrorMessage });
        }
        else if (error) {
            res.render("dashboard", { error });
        }
    }
});
exports.putNewNoteFunction = putNewNoteFunction;
function deleteNoteFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { noteId } = req.body;
            const sql = `DELETE FROM Notes WHERE NoteCode = ?`;
            const deletedNotes = yield new Promise((resolve, reject) => {
                db.run(sql, [noteId], function (err) {
                    if (err) {
                        reject(err); // Reject with the error
                    }
                    else {
                        resolve(`note with ${noteId} deleted successfully`); // Resolve with the data
                    }
                });
            });
            res.render("dashboard", { deletedNote: deletedNotes });
            // Attach the user to the request for further use
        }
        catch (error) {
            res.render("dashboard", { deletingError: error }); // Render an error message
        }
    });
}
exports.deleteNoteFunction = deleteNoteFunction;
