import React, { useContext } from "react";
import moment from "moment";

import "./TodoHistory.css";
import { Task } from "./HabiticaTypes";
import { AppContext } from "./UserHistory";
import { TaskIcon } from "./TaskIcon";

var md = require("habitica-markdown");

const TODO_FORMAT = "MMM D";

export default function TodoHistory(props: { data: Task[] }) {
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
      <div
        className="task-name"
        dangerouslySetInnerHTML={{ __html: md.render(props.todo.text) }}
      />
    </li>
  );
}
