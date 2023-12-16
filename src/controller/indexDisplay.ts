
import express, { Request, Response, NextFunction } from "express";


export function displayIndex(req: Request, res: Response){
    res.render("index", {})
}