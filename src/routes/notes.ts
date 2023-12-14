
import express, { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/jwtAuthenticate";
import { getNoteFunction, getIndividualNoteFunction, createNewNoteFunction, deleteNoteFunction, putNewNoteFunction } from "../controller/noteController";
import { noCache } from "../middleware/no-catching";

// implementation start here
const router = express.Router();


router.use(express.json());
router.use(express.urlencoded({ extended: false }));

/* GET NOTES listing. */
router.get("/", getNoteFunction);

// router.get("/login", getNoteFunction);
router.get("/dashboard", authenticate, noCache, getIndividualNoteFunction);
router.post("/dashboard", authenticate, getIndividualNoteFunction);
router.post("/dashboard/edit", authenticate, putNewNoteFunction);
router.post("/dashboard/add-new-note", authenticate, createNewNoteFunction);
router.post("/dashboard/delete-note", authenticate, deleteNoteFunction);
// updating new notes
export default router;