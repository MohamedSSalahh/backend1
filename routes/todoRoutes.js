const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const todoController = require("../controllers/todoController");

router.get("/", auth, todoController.getTodos);
router.post("/", auth, todoController.addTodo);
router.post("/update/:id", auth, todoController.updateTodo);
router.post("/delete/:id", auth, todoController.deleteTodo);
router.post("/delete", auth, todoController.deleteAllTodos);

module.exports = router;
