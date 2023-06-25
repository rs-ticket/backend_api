import { Router } from "express";

import task from "@components/task/task.router"


const router: Router = Router();

router.use(task);

export default router;

