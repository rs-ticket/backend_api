import { Router } from "express";

import task from "@components/task/task.router"
import auth from "@components/auth/auth.router"

const router: Router = Router();

router.use(task);

router.use(auth);

export default router;

