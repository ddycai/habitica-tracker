import React, { useContext, useState } from "react";
import moment from "moment";
import log from "loglevel";

import { Task } from "./HabiticaTypes";
import { DATE_KEY_FORMAT } from "./App";
import { AppContext } from "./UserHistory";
import { TaskIcon } from "./TaskIcon";
import HistoryTableHeader from "./HistoryTableHeader";

var md = require("habitica-markdown");

export interface HabitHistoryProps {
  data: Task[];
}

export default function HabitHistory(props: HabitHistoryProps) {
  const [showNoHistory, setShowNoHistory] = useState(false);

  return (
    <section className="habits">
      <table>
        <HistoryTableHeader
          title="Habits"
          setShowNoHistory={setShowNoHistory}
          showNoHistory={showNoHistory}
        />
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
      <td className="task-name-row">
        <TaskIcon task={props.habit} />
        <span
          className="task-name"
          dangerouslySetInnerHTML={{ __html: md.render(text) }}
        />
      </td>
      {dailyScores.map((score) => {
        if (score) {
          return <HabitScore up={score[0]} down={score[1]} />;
        } else {
          return <td className="habit-cell">&nbsp;</td>;
        }
      })}
    </tr>
  );
}

function HabitScore(props: { up: number; down: number }) {
  return (
    <td className="habit-cell">
      <div className="habit-score-container">
        {props.up > 0 && (
          <div className="success center-wrapper">
            <span>+{props.up}</span>
          </div>
        )}
        {props.down > 0 && (
          <div className="fail center-wrapper">
            <span>-{props.down}</span>
          </div>
        )}
      </div>
    </td>
  );
}
