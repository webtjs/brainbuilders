import { useState } from "react";
import Mainpage from "./Mainpage";
import CreationPage from "./CreationPage";

const PossibleDecks = [];

export default function TaskManager() {
  const [taskInput, setInput] = useState("");
  const [tasks, setTask] = useState(PossibleDecks);

  const handleInput = (i) => {
    setTask([
      ...tasks.slice(0, i),
      {
        task: tasks[i].task,
        completed: !tasks[i].completed
      },
      ...tasks.slice(i + 1)
    ]);
  };

  const handleNewTaskSubmit = (event) => {
    event.preventDefault();
    setTask([
      {
        task: taskInput,
        completed: false
      },
      ...tasks
    ]);
    setInput("");
  };

  const handleNewInput = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newTasks = [...tasks, { task: taskInput, completed: false }];
    setTask(newTasks);
    setInput("");
  };

  const isEmpty = tasks.length === 0;
  const taskNum = tasks.length;

  return (
    <div>
      <CreationPage />
      <h4>Add a deck of cards, Current deck Num: {taskNum}</h4>
      <form onSubmit={handleSubmit}>
        <input type="text" value={taskInput} onChange={handleNewInput} />
        <button size="medium" type="submit" onClick={handleNewTaskSubmit}>
          Add
        </button>
      </form>

      {isEmpty ? (
        <p>Empty Deck</p>
      ) : (
        <Mainpage tasks={tasks} onTaskChange={handleInput} />
      )}
    </div>
  );
}