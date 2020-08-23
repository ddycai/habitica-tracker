import React, { useContext } from "react";
import moment from "moment";

import { Task } from "./HabiticaTypes";
import { AppContext } from "./UserSummary";
import { getColorClass } from "./task-color";

const TODO_FORMAT = "MMM D";

export default function TodoSummary(props: { data: Task[] }) {
  const context = useContext(AppContext);
  const startDate = context.dates[0];
  const todos = props.data.filter((todo) =>
    moment(todo!.dateCompleted).isAfter(startDate)
  );

  return (
    <section className="todos">
      <h1>Todos</h1>
      <ul>
        <li className="todo-header-row">
          <div className="">Completed</div>
        </li>
        {todos.map((todo) => (
          <Todo todo={todo} />
        ))}
      </ul>
    </section>
  );
}

function Todo(props: { todo: Task }) {
  const context = useContext(AppContext);
  const completionDate = moment(props.todo!.dateCompleted).format(TODO_FORMAT);
  return (
    <li className="todo-row">
      {context.showTaskColors && (
        <div className={["todo-color", getColorClass(props.todo)].join(" ")}>
          &nbsp;
        </div>
      )}
      <div className="todo-content">
        <div className="todo-text">{props.todo.text}</div>
        {props.todo!.notes && (
          <div className="todo-notes">{props.todo!.notes}</div>
        )}
      </div>
      <div className="todo-date">{completionDate}</div>
    </li>
  );
}
