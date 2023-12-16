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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_path_1 = __importDefault(require("node:path"));
const sqlite3 = require("sqlite3").verbose();
// my database
const mydpPath = node_path_1.default.resolve(__dirname, "../../../", "model/usersAndNote.db");
const db = new sqlite3.Database(mydpPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err)
        return console.log(err);
});
function authenticate(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const token = req.session.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '')) || ((_b = req.headers.Authorization) === null || _b === void 0 ? void 0 : _b.replace('Bearer ', ''));
        if (!token) {
            return res.redirect("../users/login");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, 'your-secret-key');
            const queryUser = `SELECT UserId FROM Users WHERE UserId = ?`;
            const userIdFromDatabase = {};
            const selectedUserId = yield new Promise((resolve, reject) => {
                db.all(queryUser, [decoded.userId], (err, userReturned) => {
                    if (err) {
                        reject(res.status(500).json({
                            message: `userId not found`
                        }));
                    }
                    else {
                        resolve(Object.assign(userIdFromDatabase, ...userReturned));
                    }
                });
            });
            if (!userIdFromDatabase) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            else {
                // get userid from the login and passing to the next function
                req.user = { UserId: userIdFromDatabase.UserId }; // Attach the user to the request for further use
                next();
            }
        }
        catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Unauthorized' });
        }
    });
}
exports.authenticate = authenticate;
;
