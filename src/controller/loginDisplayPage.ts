import express, { Request, Response, NextFunction } from "express";

export default function signupPage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.render("login", {});
}
