const Todo = require("../../models/Todo");

exports.getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user });
  res.render("todos", { todos });
};

exports.addTodo = async (req, res) => {
  const { text } = req.body;
  await Todo.create({ text, user: req.user });
  res.redirect("/todos");
};

exports.updateTodo = async (req, res) => {
  await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    { text: req.body.text }
  );
  res.redirect("/todos");
};

exports.deleteTodo = async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, user: req.user });
  res.redirect("/todos");
};

exports.deleteAllTodos = async (req, res) => {
  await Todo.deleteMany({ user: req.user });
  res.redirect("/todos");
};
