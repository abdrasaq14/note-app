"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signupDisplayPage_1 = __importDefault(require("../controller/signupDisplayPage"));
const signup_1 = require("../controller/signup");
const loginDisplayPage_1 = __importDefault(require("../controller/loginDisplayPage"));
const login_1 = require("../controller/login");
const logout_1 = require("../controller/logout");
// implementation start here
const router = express_1.default.Router();
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({ extended: false }));
// GET all users route
router.get("/signup", signupDisplayPage_1.default);
// Creating new user
router.post("/signup", signup_1.signupUserFunction);
// new user login
router.get("/login", loginDisplayPage_1.default);
router.post("/login", login_1.handleUserLogin);
// log out page
router.get("/logout", logout_1.clearCookieOnLogout);
exports.default = router;
