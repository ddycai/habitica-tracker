import React, { useContext } from "react";
import dayjs, { Dayjs } from "dayjs";

import ReactTooltip from "react-tooltip";
import { ReactComponent as TrivialIcon } from "./svg/difficulty-trivial.svg";

import "./TaskIcon.css";
import { Task } from "./HabiticaTypes";
import { AppContext } from "./UserHistory";

const DATE_FORMAT = "ddd MMM D";
const DATE_FORMAT_WITH_YEAR = `MMM D YYYY`;

export function TaskIcon(props: { task: Task }) {
  const context = useContext(AppContext);
  const classNames = [
    "task-icon-container",
    "center-wrapper",
    getColorClass(props.task),
  ].join(" ");

  const numStars = getDifficultyLevel(props.task.priority);
  const stars = Array.from({ length: numStars }, (x, i) => (
    <TrivialIcon key={i} fill="white" aria-hidden />
  ));
  const taskValue = props.task.value.toFixed(1);

  let nextDue: Dayjs | undefined;
  if (props.task.nextDue) {
    nextDue = dayjs(props.task.nextDue[0]);
  }
  return context.showTaskIcons ? (
    <React.Fragment>
      <div data-tip data-for={props.task.id} className={classNames}>
        {stars}
      </div>
      <ReactTooltip id={props.task.id} place="left" effect="solid">
        {nextDue ? (
          <div>
            <b>Next due:</b> {formatDate(nextDue)}
          </div>
        ) : null}
        <div>
          <b>Task value:</b> {taskValue}
        </div>
      </ReactTooltip>
    </React.Fragment>
  ) : null;
}

function formatDate(date: Dayjs): string {
  const now = dayjs();
  if (date.diff(now, "day") < 1) {
    return "tomorrow";
  } else if (date.diff(now, "day") < 6) {
    return date.format("dddd");
  } else if (date.year === dayjs().year) {
    return date.format(DATE_FORMAT);
  } else {
    return date.format(DATE_FORMAT_WITH_YEAR);
  }
}

function getDifficultyLevel(priority: number) {
  return Math.ceil(priority / 0.5);
}

const VALUE_THRESHOLDS = [-16, -9, -1, 1, 6, 12];
const COLOR_CLASS = ["worst", "worse", "bad", "neutral", "good", "better"];

function getColorClass(task: Task): string {
  for (let i = 0; i < VALUE_THRESHOLDS.length; i++) {
    if (task.value < VALUE_THRESHOLDS[i]) {
      return COLOR_CLASS[i];
    }
  }
  return "best";
}
