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
exports.signupUserFunction = void 0;
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const node_path_1 = __importDefault(require("node:path"));
const uuidFunction_1 = require("./uuidFunction");
const sqlite3 = require("sqlite3").verbose();
// my database
const mydpPath = node_path_1.default.resolve(__dirname, "../../../", "model/usersAndNote.db");
const db = new sqlite3.Database(mydpPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err)
        return console.log(err);
});
// new user schema
const newUserSchema = zod_1.z.object({
    fullname: zod_1.z
        .string({
        required_error: "fullname needs to be provided",
        invalid_type_error: "fullname needs to be a string",
    })
        .trim()
        .min(2, "fullname need to have a min length of 2")
        .max(50, "fullname need to have a max length of 50"),
    email: zod_1.z
        .string({
        required_error: "email needs to be provided",
        invalid_type_error: "email needs to be a string",
    })
        .email(),
    gender: zod_1.z.string().max(6),
    phone: zod_1.z.string().max(14),
    address: zod_1.z.string().min(10).max(100),
    password: zod_1.z
        .string({
        required_error: "password needs to be provided",
        invalid_type_error: "pass needs to be a string",
    })
        .min(6, "password must be at least 6 characters"),
});
const strictNewUserSchema = newUserSchema.strict();
function signupUserFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validation = strictNewUserSchema.parse(req.body);
            const { fullname, gender, email, phone, address, password } = validation;
            // Check for duplicate email
            const sql = `SELECT Email FROM Users`;
            const selectEmailFromDatabase = yield new Promise((resolve, reject) => {
                db.all(sql, (error, users) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(users);
                    }
                });
            });
            //res.render("signup", { selectEmailFromDatabase})
            const checkDuplicateemail = selectEmailFromDatabase.find((element) => element.Email === email);
            // checking if the email already exists
            if (checkDuplicateemail) {
                res.render("signup", {
                    EmailExistError: `User with ${email} already exist`,
                });
            }
            else {
                // Encrypt password
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const generateUserID = (0, uuidFunction_1.generateUUID)();
                // Store the new user
                const insertSql = `INSERT INTO Users (
          UserId, 
          Full_name,
          Gender, 
          Email, 
          Phone_no, 
          Address,
          Password
         ) 
         VALUES (?,?,?,?,?,?,?)`;
                const insertUserDetailIntoDatabase = yield new Promise((resolve, reject) => {
                    db.run(insertSql, [
                        generateUserID,
                        fullname,
                        gender,
                        email,
                        phone,
                        address,
                        hashedPassword,
                    ], function (err) {
                        if (err) {
                            // return `Error in database operation: ${err}`;
                            reject(err);
                        }
                        else {
                            resolve(`New User with ${email} created`);
                        }
                    });
                });
                res.render("signup", {
                    insertUserDetailIntoDatabase: insertUserDetailIntoDatabase,
                });
            }
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const zodErrorMessage = error.issues.map((issue) => issue.message);
                res.render("signup", { zodError: zodErrorMessage });
            }
            else if (error) {
                res.render("signup", { databaseError: error });
            }
        }
    });
}
exports.signupUserFunction = signupUserFunction;
