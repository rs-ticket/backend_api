import { Router } from "express";
import TaskModel from "@components/task/task.model";

const router: Router = Router();

router.get('/task', async (req, res) => {
    await TaskModel.find({})
        .then((data) =>
            res.send(data)
        );
});

router.post('/task', (req, res) => {
    const task = new TaskModel(req.body);
    task.save();
    res.json(task);
});

router.put('/task/:id', async (req, res) => {
    const task = await TaskModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.send(task);
});

router.delete('/task/:id', async (req, res) => {
    await TaskModel.findByIdAndDelete(req.params.id);
    res.json({message: 'Task deleted'});
});

export default router;