import { Router } from "express";
import { getFirstQuestion, sendAnswer } from "./kbs.controller";
import { protect } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validate";
import { kbsAnswerSchema } from "../../validations/kbs.validation";

const router = Router();

// GET first question
router.get("/questions", protect,getFirstQuestion);
router.post("/answer",protect,validate(kbsAnswerSchema), sendAnswer);
export default router;