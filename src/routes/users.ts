import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import signupPage from "../controller/signupDisplayPage";
import { signupUserFunction } from "../controller/signup";
import loginDisplayPage from "../controller/loginDisplayPage";
import { handleUserLogin } from "../controller/login";
import { clearCookieOnLogout } from "../controller/logout";
import session from "express-session";

// implementation start here
const router = express.Router();


// GET all users route
router.get("/signup", signupPage);

// Creating new user
router.post("/signup", signupUserFunction);

// new user login
router.get("/login", loginDisplayPage);

router.post("/login", handleUserLogin);

// log out page
router.get("/logout", clearCookieOnLogout);

export default router;
