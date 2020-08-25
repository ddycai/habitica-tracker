import React, { useContext } from "react";

import { ReactComponent as TrivialIcon } from "./svg/difficulty-trivial.svg";

import "./TaskIcon.css";
import { Task } from "./HabiticaTypes";
import { AppContext } from "./UserSummary";

export function TaskIcon(props: { task: Task }) {
  const context = useContext(AppContext);
  const classNames = [
    "task-icon-container",
    "center-wrapper",
    getColorClass(props.task),
  ].join(" ");

  const stars = Array(getDifficultyLevel(props.task.priority)).fill(
    <TrivialIcon fill="white" aria-hidden />
  );
  return context.showTaskIcons ? (
    <div className={classNames}>{stars}</div>
  ) : null;

  /*
  return context.showTaskIcons ? (
    <div className={classNames}>{icon}</div>
  ) : null;
  */
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
