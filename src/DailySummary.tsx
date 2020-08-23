import React, { useContext, useState } from "react";
import moment from "moment";
import log from "loglevel";

import { DATE_KEY_FORMAT } from "./App";
import { Task } from "./HabiticaTypes";
import { AppContext } from "./UserSummary";
import { getColorClass } from "./task-color";

export interface DailySummaryProps {
  data: Task[];
}

export default function DailySummary(props: DailySummaryProps) {
  const context = useContext(AppContext);
  const [showNoHistory, setShowNoHistory] = useState(false);

  return (
    <section className="dailys">
      <h2>Dailies</h2>
      <div>
        <input
          type="checkbox"
          onClick={() => setShowNoHistory(!showNoHistory)}
        />
        Show dailies with no history
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
        {props.data.map((daily) => (
          <Daily showNoHistory={showNoHistory} daily={daily} />
        ))}
      </table>
    </section>
  );
}

export function Daily(props: { daily: Task; showNoHistory: boolean }) {
  const context = useContext(AppContext);
  const historyMap = new Map<string, number>();

  const { text, history } = props.daily;

  log.debug(text);
  for (let i = 0; i < history.length; i++) {
    let delta;
    if (i === 0) {
      delta = history[i].value;
    } else {
      delta = history[i].value - history[i - 1].value;
    }
    let taskUpdateTime = moment(history[i].date);
    log.debug(
      taskUpdateTime.format("YYYY-MM-DD HH:mm:ss") + ": " + history[i].value
    );
    // Only consider times when the task value changes (or the first value).
    if (delta !== 0) {
      // This task update was done via cron so the task was actually done the
      // day before.
      if (
        context.cronIntervals.search(
          taskUpdateTime.unix(),
          taskUpdateTime.unix()
        ).length > 0
      ) {
        taskUpdateTime = taskUpdateTime.subtract(1, "day");
      }
      const taskDate = taskUpdateTime.format(DATE_KEY_FORMAT);
      if (historyMap.has(taskDate)) {
        log.debug(`Found date conflict for task ${text} on ${taskDate}`);
      }
      historyMap.set(taskDate, delta);
    }
  }

  const dailyDeltas = context.dates
    .map((day) => day.format(DATE_KEY_FORMAT))
    .map((day) => historyMap.get(day));

  if (
    dailyDeltas.filter((delta) => delta !== undefined).length === 0 &&
    !props.showNoHistory
  ) {
    // Don't render the component if showNoHistory is off.
    return null;
  }

  return (
    <tr>
      {context.showTaskColors && <td className={getColorClass(props.daily)}></td>}
      <td>{text}</td>
      {dailyDeltas.map((delta) => (
        <DailyStatus delta={delta} />
      ))}
    </tr>
  );
}

function DailyStatus(props: { delta: number | undefined }) {
  let className;
  let symbol;
  if (!props.delta || props.delta === 0) {
    className = "daily-none";
    symbol = "-";
  } else if (props.delta > 0) {
    className = "daily-success";
    symbol = "✓";
  } else {
    className = "daily-fail";
    symbol = "✖";
  }
  return (
    <td className={className}>
      <div className="center-wrapper">
        <span className="symbol">{symbol}</span>
      </div>
    </td>
  );
}
