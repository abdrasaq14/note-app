"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtAuthenticate_1 = require("../middleware/jwtAuthenticate");
const noteController_1 = require("../controller/noteController");
const no_catching_1 = require("../middleware/no-catching");
// implementation start here
const router = express_1.default.Router();
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({ extended: false }));
/* GET NOTES listing. */
router.get("/", noteController_1.getNoteFunction);
// router.get("/login", getNoteFunction);
router.get("/dashboard", jwtAuthenticate_1.authenticate, no_catching_1.noCache, noteController_1.getIndividualNoteFunction);
router.post("/dashboard", jwtAuthenticate_1.authenticate, noteController_1.getIndividualNoteFunction);
router.post("/dashboard/edit", jwtAuthenticate_1.authenticate, noteController_1.putNewNoteFunction);
router.post("/dashboard/add-new-note", jwtAuthenticate_1.authenticate, noteController_1.createNewNoteFunction);
router.post("/dashboard/delete-note", jwtAuthenticate_1.authenticate, noteController_1.deleteNoteFunction);
// updating new notes
exports.default = router;
