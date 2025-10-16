import { Router } from "express";
import { incrementView } from "../controllers/view.controller";
import verifyJWT from "../middleware/auth.middleware";

const router = Router();

// Optional auth - works for both logged in and anonymous users
router.post(
  "/view/:videoId",
  (req, res, next) => {
    // Try to verify JWT, but don't fail if not present
    if (req.headers.authorization) {
      return verifyJWT(req, res, next);
    }
    next();
  },
  incrementView
);

export default router;
