import React, { useContext, useState } from "react";
import moment from "moment";
import log from "loglevel";

import { Task } from "./HabiticaTypes";
import { DATE_KEY_FORMAT } from "./App";
import { AppContext } from "./UserSummary";
import { getColorClass } from "./task-color";

export interface HabitSummaryProps {
  data: Task[];
}

export default function HabitSummary(props: HabitSummaryProps) {
  const context = useContext(AppContext);
  const [showNoHistory, setShowNoHistory] = useState(false);

  return (
    <section className="habits">
      <h2>Habits</h2>
      <div>
        <input
          type="checkbox"
          onClick={() => setShowNoHistory(!showNoHistory)}
        />
        Show habits with no history
      </div>
      <table>
        <tr>
          {context.showTaskColors && <th>{/* Task color box */}</th>}
          <th>{/* Task name */}</th>
          {context.dates.map((day) => (
            <th>
              <div className="date heading">
                <span>{day.format("MM")}</span>
                <span>{day.format("DD")}</span>
              </div>
            </th>
          ))}
        </tr>
        {props.data.map((habit) => (
          <Habit showNoHistory={showNoHistory} habit={habit} />
        ))}
      </table>
    </section>
  );
}

export function Habit(props: { habit: Task; showNoHistory: boolean }) {
  const context = useContext(AppContext);
  const historyMap = new Map<string, [number, number]>();
  const { text, history } = props.habit;

  log.debug(text);
  for (let record of history) {
    let taskDate = moment(record.date).format(DATE_KEY_FORMAT);
    log.debug(JSON.stringify(record));
    if (record.scoredUp !== undefined && record.scoredDown !== undefined) {
      historyMap.set(taskDate, [record.scoredUp, record.scoredDown]);
    }
  }

  const dailyScores = context.dates
    .map((day) => day.format(DATE_KEY_FORMAT))
    .map((day) => historyMap.get(day));

  if (
    dailyScores.filter((score) => score !== undefined).length === 0 &&
    !props.showNoHistory
  ) {
    // Don't render the component if showNoHistory is off.
    return null;
  }

  return (
    <tr>
      {context.showTaskColors && <td className={getColorClass(props.habit)}></td>}
      <td>{text}</td>
      {dailyScores.map((score) => {
        if (score) {
          return <HabitScore up={score[0]} down={score[1]} />;
        } else {
          return (
            <td className="habit-none">
              <div className="center-wrapper">
                <span className="symbol">-</span>
              </div>
            </td>
          );
        }
      })}
    </tr>
  );
}

function HabitScore(props: { up: number; down: number }) {
  return (
    <td>
      <div className="habit-score">
        {props.up > 0 && (
          <div className="habit-up center-wrapper">
            <span>+{props.up}</span>
          </div>
        )}
        {props.down > 0 && (
          <div className="habit-down center-wrapper">
            <span>-{props.down}</span>
          </div>
        )}
      </div>
    </td>
  );
}
