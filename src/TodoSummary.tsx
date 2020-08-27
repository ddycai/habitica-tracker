import React, { useContext } from "react";
import moment from "moment";

import "./TodoSummary.css";
import { Task } from "./HabiticaTypes";
import { AppContext } from "./UserSummary";
import { TaskIcon } from "./TaskIcon";

const TODO_FORMAT = "MMM D";

export default function TodoSummary(props: { data: Task[] }) {
  const context = useContext(AppContext);
  const startDate = context.dates[0];
  const todos = props.data.filter((todo) =>
    moment(todo!.dateCompleted).isAfter(startDate)
  );

  return (
    <section className="todos">
      <h2>Completed Todos</h2>
      <ul>
        {todos.map((todo) => (
          <Todo todo={todo} />
        ))}
      </ul>
    </section>
  );
}

function Todo(props: { todo: Task }) {
  const completionDate = moment(props.todo!.dateCompleted).format(TODO_FORMAT);
  return (
    <li className="todo-row">
      <TaskIcon task={props.todo} />
      <span className="todo-date date">{completionDate}</span>
      <div className="todo-content">{props.todo.text}</div>
    </li>
  );
}
