import express from "express";
import { displayIndex } from "../controller/indexDisplay";
import { getNoteFunction } from "../controller/noteController";
import { Response, Request } from "express";

// implementation start here
const router = express.Router();


router.use(express.json());
router.use(express.urlencoded({ extended: false }));

/* GET home page. */
router.get('/', displayIndex);

export default router;
